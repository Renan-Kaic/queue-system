using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.TicketHandler;

public class GetAllTicketsHandler
{
    public async Task<ApiResponse<IList<Ticket>>> Handle(
        GetAllTicketsCommand command,
        ITicketRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var tickets = await repository.GetAllAsync(cancellationToken);
            return ApiResponse<IList<Ticket>>.Ok(tickets, "Tickets recuperados com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<IList<Ticket>>.InternalServerError(
                "Erro ao buscar tickets.",
                ["Ocorreu um erro ao buscar os tickets. Tente novamente mais tarde."]
            );
        }
    }
}
