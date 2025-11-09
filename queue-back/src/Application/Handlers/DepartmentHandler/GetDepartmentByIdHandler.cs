using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.DepartmentHandler;

public class GetDepartmentByIdHandler
{
    public async Task<ApiResponse<Department?>> Handle(
        GetDepartmentByIdCommand command,
        IDepartmentRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var department = await repository.GetByIdAsync(command.Id, cancellationToken);
            if (department is null)
            {
                return ApiResponse<Department?>.NotFound(
                    "Departamento não encontrado.",
                    [$"Nenhum departamento foi encontrado com o ID '{command.Id}'."]
                );
            }

            return ApiResponse<Department?>.Ok(department, "Departamento encontrado com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<Department?>.InternalServerError(
                "Erro ao buscar departamento.",
                ["Ocorreu um erro ao buscar o departamento. Tente novamente mais tarde."]
            );
        }
    }
}
