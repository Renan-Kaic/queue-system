using cronly_back.Application.Commands;
using cronly_back.Domain.Enums;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.TicketHandler;

public class DeleteTicketHandler
{
    public async Task<ApiResponse<bool>> Handle(
        DeleteTicketCommand command,
        ITicketRepository ticketRepository,
        IQueueRepository queueRepository,
        CancellationToken cancellationToken)
    {
        try
        {
            var ticket = await ticketRepository.GetByIdAsync(command.Id, cancellationToken);

            if (ticket is null)
            {
                return ApiResponse<bool>.NotFound(
                    "Ticket não encontrado.",
                    [$"Nenhum ticket foi encontrado com o ID '{command.Id}'."]
                );
            }

            var queue = await queueRepository.GetByIdAsync(ticket.QueueId, cancellationToken);
            if (queue is not null && queue.CurrentQueueSize > 0 && ticket.TicketStatus == TicketStatus.Waiting)
            {
                queue.CurrentQueueSize--;
                await queueRepository.UpdateAsync(queue, cancellationToken);
            }

            var deleted = await ticketRepository.DeleteAsync(ticket, cancellationToken);

            if (!deleted)
            {
                return ApiResponse<bool>.InternalServerError(
                    "Erro ao excluir ticket.",
                    ["Ocorreu um erro ao excluir o ticket. Tente novamente mais tarde."]
                );
            }

            return ApiResponse<bool>.Ok(true, "Ticket excluído com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<bool>.InternalServerError(
                "Erro ao excluir ticket.",
                ["Ocorreu um erro ao excluir o ticket. Tente novamente mais tarde."]
            );
        }
    }
}
