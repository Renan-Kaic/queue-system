using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.DepartmentHandler;

public class UpdateDepartmentHandler
{
    public async Task<ApiResponse<Department?>> Handle(
        UpdateDepartmentCommand command, 
        IDepartmentRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var department = await repository.GetByIdAsync(command.Id, cancellationToken);
            if (department is null)
            {
                return ApiResponse<Department?>.NotFound("Não foi encontrado um departamento com os dados informados.",
                    [$"Não existe um departamento com o ID '{command.Id}'."]);
            }
            
            if (department.Name != command.Name){
                var verifyDeptoName = await repository.GetByNameAsync(command.Name, cancellationToken);

                if (verifyDeptoName is not null && verifyDeptoName.Id != command.Id)
                {
                    return ApiResponse<Department?>.Conflict(
                        "Já existe um departamento cadastrado com o nome informado.",
                        [$"Já existe um departamento cadastrado com o nome '{command.Name}'."]
                    );
                }
            }

            if (command.Code != department.Code)
            {
                var verifyDeptoCode = await repository.GetByCodeAsync(command.Code, cancellationToken);

                if (verifyDeptoCode is not null && verifyDeptoCode.Id != command.Id)
                {
                    return ApiResponse<Department?>.Conflict(
                        "Já existe um departamento cadastrado com o codigo informado.",
                        [$"Já existe um departamento cadastrado com o codigo '{command.Code}'."]
                    );
                }
            }
            
            department.Update(command.Name, command.Code, command.Description, command.Capacity, command.Status);
            var response = await repository.UpdateAsync(department, cancellationToken);
            if (response is null)
            {
                return ApiResponse<Department?>.InternalServerError(
                    "Erro ao atualizar o departamento.",
                    ["Ocorreu um erro ao atualizar o departamento. Tente novamente mais tarde."]
                );           
            }
            
            return ApiResponse<Department?>.Ok(response, "Departamento atualizado com sucesso.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}