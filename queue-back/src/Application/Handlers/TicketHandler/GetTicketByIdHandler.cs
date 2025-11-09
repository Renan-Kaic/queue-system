using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.TicketHandler;

public class GetTicketByIdHandler
{
    public async Task<ApiResponse<Ticket?>> Handle(
        GetTicketByIdCommand command,
        ITicketRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var ticket = await repository.GetByIdAsync(command.Id, cancellationToken);

            if (ticket is null)
            {
                return ApiResponse<Ticket?>.NotFound(
                    "Ticket não encontrado.",
                    [$"Nenhum ticket foi encontrado com o ID '{command.Id}'."]
                );
            }

            return ApiResponse<Ticket?>.Ok(ticket, "Ticket recuperado com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<Ticket?>.InternalServerError(
                "Erro ao buscar ticket.",
                ["Ocorreu um erro ao buscar o ticket. Tente novamente mais tarde."]
            );
        }
    }
}
