using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.DepartmentHandler;

public class GetAllDepartmentsHandler
{
    public async Task<ApiResponse<IList<Department>>> Handle(
        GetAllDepartmentsCommand command,
        IDepartmentRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var departments = await repository.GetAllAsync(cancellationToken);
            return ApiResponse<IList<Department>>.Ok(departments, "Departamentos recuperados com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<IList<Department>>.InternalServerError(
                "Erro ao buscar departamentos.",
                ["Ocorreu um erro ao buscar os departamentos. Tente novamente mais tarde."]
            );
        }
    }
}
