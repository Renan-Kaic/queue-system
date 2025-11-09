using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.CitizenHandler;

public class GetAllCitizensHandler
{
    public async Task<ApiResponse<IList<Citizen>>> Handle(
        GetAllCitizensCommand command,
        ICitizenRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var citizens = await repository.GetAllAsync(cancellationToken);
            return ApiResponse<IList<Citizen>>.Ok(citizens, "Clientes recuperados com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<IList<Citizen>>.InternalServerError(
                "Erro ao buscar clientes.",
                ["Ocorreu um erro ao buscar os clientes. Tente novamente mais tarde."]
            );
        }
    }
}
