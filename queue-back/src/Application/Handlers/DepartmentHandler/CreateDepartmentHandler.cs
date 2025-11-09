using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.DepartmentHandler;

public class CreateDepartmentHandler ()
{
    public async Task<ApiResponse<Department?>> Handle(
        CreateDepartmentCommand command,
        IDepartmentRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var existingDepartment = await repository.GetDuplicateDepartmentAsync(
                command.Name, 
                command.Code, 
                cancellationToken
            );

            if (existingDepartment is not null)
            {
                if (existingDepartment.Name.Equals(command.Name, StringComparison.OrdinalIgnoreCase))
                {
                    return ApiResponse<Department?>.Conflict(
                        "Já existe um departamento cadastrado com o nome informado.",
                        [$"Já existe um departamento cadastrado com o nome '{command.Name}'."]
                    );
                }
                
                if (existingDepartment.Code.Equals(command.Code, StringComparison.OrdinalIgnoreCase))
                {
                    return ApiResponse<Department?>.Conflict(
                        "Já existe um departamento cadastrado com o codigo informado.",
                        [$"Já existe um departamento cadastrado com o codigo '{command.Code}'."]
                    );
                }
            }
            
            var department = new Department
            {
                Name = command.Name,
                Code = command.Code,
                Description = command.Description,
                Capacity = command.Capacity,
                Status = command.Status
            };
            
            var response = await repository.AddAsync(department, cancellationToken);

            if (response is null)
            {
                return ApiResponse<Department?>.InternalServerError(
                    "Erro ao criar o departamento.",
                    ["Ocorreu um erro ao criar o departamento. Tente novamente mais tarde."]
                );
            }
            
            return ApiResponse<Department?>.Created(response, "Departamento criado com sucesso.");
        }
        catch (Exception e)
        {
            return ApiResponse<Department?>.InternalServerError(
                "Erro ao criar o departamento.",
                ["Ocorreu um erro ao criar o cliente. Tente novamente mais tarde."]
            );
        }
    }
}