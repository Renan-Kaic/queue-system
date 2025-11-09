using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.CitizenHandler;

public class GetCitizenByIdHandler
{
    public async Task<ApiResponse<Citizen?>> Handle(
        GetCitizenByIdCommand command,
        ICitizenRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var citizen = await repository.GetByIdAsync(command.Id, cancellationToken);
            if (citizen is null)
            {
                return ApiResponse<Citizen?>.NotFound(
                    "Cliente não encontrado.",
                    [$"Nenhum cliente foi encontrado com o ID '{command.Id}'."]
                );
            }

            return ApiResponse<Citizen?>.Ok(citizen, "Cliente encontrado com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<Citizen?>.InternalServerError(
                "Erro ao buscar cliente.",
                ["Ocorreu um erro ao buscar o cliente. Tente novamente mais tarde."]
            );
        }
    }
}
