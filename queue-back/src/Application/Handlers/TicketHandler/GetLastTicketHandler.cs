using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Application.Services;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.TicketHandler;

public class GetLastTicketHandler
{
    public async Task<ApiResponse<TicketResponseDto?>> Handle(
        GetLastTicketCommand command,
        ITicketRepository repository,
        IQueueRepository queueRepository,
        INotificationService notificationService,
        CancellationToken cancellationToken)
    {
        try
        {
            var queue = await queueRepository.GetByIdAsync(command.QueueId, cancellationToken);

            if (queue is null)
            {
                return ApiResponse<TicketResponseDto?>.NotFound(
                    "Não foi encontrado fila com o Id informado. Verifique os dados e tente novamente.");
            }

            var response = await repository.GetLastCalledTicketAsync(command.QueueId, cancellationToken);

            if (response is null)
            {
                return ApiResponse<TicketResponseDto?>.NotFound("Não existe tickets na fila para serem chamados.");
            }
            
            await notificationService.NotifyTicketCalled(response, queue.Name, queue.Department.Name);
            
            return ApiResponse<TicketResponseDto?>.Ok(
                MapResponse(response),
                "Ticket recuperado com sucesso.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
    private static TicketResponseDto MapResponse(Ticket ticket)
    {
        return new TicketResponseDto
        {
            Id = ticket.Id,
            TicketCode = ticket.TicketCode,
            QueueId = ticket.QueueId,
            CitizenId = ticket.CitizenId,
            TicketStatus = ticket.TicketStatus,
            Priority = ticket.Priority,
            IssuedAt = ticket.IssuedAt,
            CalledAt = ticket.CalledAt,
            StartedAt = ticket.StartedAt,
            CompletedAt = ticket.CompletedAt,
            CancelledAt = ticket.CancelledAt
        };
    }
}