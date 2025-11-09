using cronly_back.Application.Commands;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.CitizenHandler;

public class DeleteCitizenHandler
{
    public async Task<ApiResponse<bool>> Handle(
        DeleteCitizenCommand command,
        ICitizenRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var citizen = await repository.GetByIdAsync(command.Id, cancellationToken);

            if (citizen is null)
            {
                return ApiResponse<bool>.NotFound(
                    "Usuario não encontrado.",
                    [$"Nenhum usuario foi encontrado com o ID '{command.Id}'."]
                );
            }

            var deleted = await repository.DeleteAsync(citizen, cancellationToken);

            if (!deleted)
            {
                return ApiResponse<bool>.InternalServerError(
                    "Erro ao excluir usuario.",
                    ["Ocorreu um erro ao excluir o usuario. Tente novamente mais tarde."]
                );
            }

            return ApiResponse<bool>.Ok(true, "Usuario excluído com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<bool>.InternalServerError(
                "Erro ao excluir usuario.",
                ["Ocorreu um erro ao excluir o usuario. Tente novamente mais tarde."]
            );
        }
    }
}
