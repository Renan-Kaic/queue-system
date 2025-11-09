using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.TicketHandler;

public class UpdateTicketHandler
{
    public async Task<ApiResponse<Ticket?>> Handle(
        UpdateTicketCommand command,
        ITicketRepository ticketRepository,
        CancellationToken cancellationToken)
    {
        try
        {
            var ticket = await ticketRepository.GetByIdAsync(command.Id, cancellationToken);

            if (ticket is null)
            {
                return ApiResponse<Ticket?>.NotFound(
                    "Ticket não encontrado.",
                    [$"Nenhum ticket foi encontrado com o ID '{command.Id}'."]
                );
            }

            if (!string.Equals(ticket.TicketCode, command.TicketNumber, StringComparison.OrdinalIgnoreCase))
            {
                var duplicate = await ticketRepository.GetByCodeAsync(command.TicketNumber, cancellationToken);
                if (duplicate is not null && duplicate.Id != ticket.Id)
                {
                    return ApiResponse<Ticket?>.Conflict(
                        "Código de ticket já utilizado.",
                        [$"Já existe um ticket com o código '{command.TicketNumber}'."]
                    );
                }
            }

            ticket.Update(command.TicketNumber, command.TicketStatus, command.Priority);

            var updatedTicket = await ticketRepository.UpdateAsync(ticket, cancellationToken);

            if (updatedTicket is null)
            {
                return ApiResponse<Ticket?>.InternalServerError(
                    "Erro ao atualizar o ticket.",
                    ["Ocorreu um erro ao atualizar o ticket. Tente novamente mais tarde."]
                );
            }

            return ApiResponse<Ticket?>.Ok(updatedTicket, "Ticket atualizado com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<Ticket?>.InternalServerError(
                "Erro ao atualizar o ticket.",
                ["Ocorreu um erro ao atualizar o ticket. Tente novamente mais tarde."]
            );
        }
    }
}
