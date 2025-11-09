using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.QueueHandler;

public class CreateQueueHandler
{
    public async Task<ApiResponse<Queue?>> Handle(
        CreateQueueCommand command,
        IQueueRepository repository,
        IDepartmentRepository departmentRepository,
        CancellationToken cancellationToken)
    {
        try
        {
            var department = await departmentRepository.GetByIdAsync(command.DepartmentId, cancellationToken);
            
            if (department is null)
            {
                return ApiResponse<Queue?>.NotFound("Não existe um departamento com o ID informado.", 
                    ["Não existe um departamento com o ID informado."]);
            }
            
            var existingQueue = await repository.GetDuplicateInDepartmentAsync(
                command.Name, 
                command.Code, 
                command.DepartmentId, 
                cancellationToken
            );
            
            if (existingQueue is not null)
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

            var queue = new Queue
            {
                Name = command.Name,
                Code = command.Code,
                DepartmentId = command.DepartmentId,
                Description = command.Description,
                MaxQueueSize = command.MaxQueueSize,
                Status = command.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var response = await repository.AddAsync(queue, cancellationToken);
            
            if (response is null)
            {
                return ApiResponse<Queue?>.InternalServerError(
                    "Erro ao criar a fila.",
                    ["Ocorreu um erro ao criar a fila. Tente novamente mais tarde."]
                );           
            }
            
            return ApiResponse<Queue?>.Created(response, "Fila criada com sucesso.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            
            return ApiResponse<Queue?>.InternalServerError(
                "Erro ao criar a fila.",
                ["Ocorreu um erro ao criar a fila. Tente novamente mais tarde."]
            );
        }
    }
}