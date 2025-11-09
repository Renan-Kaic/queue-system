using cronly_back.Application.Commands;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.DepartmentHandler;

public class DeleteDepartmentHandler
{
    public async Task<ApiResponse<bool>> Handle(
        DeleteDepartmentCommand command,
        IDepartmentRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var deleted = await repository.DeleteAsync(command.Id, cancellationToken);
            
            if (!deleted)
            {
                return ApiResponse<bool>.NotFound(
                    "Departamento não encontrado.",
                    [$"Nenhum departamento foi encontrado com o ID '{command.Id}'."]
                );
            }

            return ApiResponse<bool>.Ok(true, "Departamento excluído com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<bool>.InternalServerError(
                "Erro ao excluir departamento.",
                ["Ocorreu um erro ao excluir o departamento. Tente novamente mais tarde."]
            );
        }
    }
}
