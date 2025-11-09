using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.QueueHandler;

public class UpdateQueueHandler
{
    public async Task<ApiResponse<Queue?>> Handle(
        UpdateQueueCommand command, 
        IQueueRepository repository,
        IDepartmentRepository departmentRepository,
        CancellationToken cancellationToken)
    {
        try
        {
            var queue = await repository.GetByIdAsync(command.Id, cancellationToken);
            if (queue is null)
            {
                return ApiResponse<Queue?>.NotFound("Não foi encontrada uma fila com os dados informados.",
                    [$"Não existe uma fila com o ID '{command.Id}'."]);
            }

            var department = await departmentRepository.GetByIdAsync(command.DepartmentId, cancellationToken);
            if (department is null)
            {
                return ApiResponse<Queue?>.NotFound("Não existe um departamento com o ID informado.", 
                    ["Não existe um departamento com o ID informado."]);
            }
            
            if (queue.Name != command.Name || queue.Code != command.Code)
            {
                var existingQueue = await repository.GetDuplicateInDepartmentAsync(
                    command.Name, 
                    command.Code, 
                    command.DepartmentId, 
                    cancellationToken
                );
                
                if (existingQueue is not null && existingQueue.Id != command.Id)
                {
                    if (existingQueue.Name.Equals(command.Name, StringComparison.OrdinalIgnoreCase))
                    {
                        return ApiResponse<Queue?>.Conflict(
                            "Nome de fila já existente neste departamento.",
                            [$"Já existe uma fila com o nome '{command.Name}' no departamento '{department.Name}'."]
                        );
                    }
                    
                    if (existingQueue.Code.Equals(command.Code, StringComparison.OrdinalIgnoreCase))
                    {
                        return ApiResponse<Queue?>.Conflict(
                            "Código de fila já existente neste departamento.",
                            [$"Já existe uma fila com o código '{command.Code}' no departamento '{department.Name}'."]
                        );
                    }
                }
            }
            
            queue.Update(command.Name, command.Code, command.Description ?? string.Empty, 
                command.MaxQueueSize, command.DepartmentId, command.Status);
                
            var response = await repository.UpdateAsync(queue, cancellationToken);
            if (response is null)
            {
                return ApiResponse<Queue?>.InternalServerError(
                    "Erro ao atualizar a fila.",
                    ["Ocorreu um erro ao atualizar a fila. Tente novamente mais tarde."]
                );           
            }
            
            return ApiResponse<Queue?>.Ok(response, "Fila atualizada com sucesso.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            
            return ApiResponse<Queue?>.InternalServerError(
                "Erro ao atualizar a fila.",
                ["Ocorreu um erro ao atualizar a fila. Tente novamente mais tarde."]
            );
        }
    }
}
