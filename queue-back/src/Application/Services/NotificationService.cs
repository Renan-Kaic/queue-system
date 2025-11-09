using cronly_back.API.Hubs;
using cronly_back.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace cronly_back.Application.Services;

public class NotificationService (
    IHubContext<TicketHub> hubContext,
    ILogger<NotificationService> logger,
    UserManager<ApplicationUser> userManager,
    IHttpContextAccessor httpContextAccessor) : INotificationService
{
    public async Task NotifyTicketCalled(Ticket ticket, string queueName, string departmentName)
    {
        try
        {
            var user = await userManager.GetUserAsync(httpContextAccessor.HttpContext?.User!);

            var notification = new
            {
                Type = "TicketCalled",
                TicketId = ticket.Id,
                TicketCode = ticket.TicketCode,
                TicketNumber = ticket.Id,
                QueueId = ticket.QueueId,
                QueueName = queueName,
                DepartmentName = departmentName,
                CitizenId = ticket.CitizenId,
                CalledAt = DateTime.UtcNow,
                Message = $"Senha {ticket.TicketCode} chamada para {departmentName}"
            };

            
            // Notificar grupo específico da fila
           /* await hubContext.Clients.Group($"queue_{ticket.QueueId}")
                .SendAsync("TicketCalled", notification);
*/
           
           await hubContext.Clients.Group($"user_{user!.Id}")
               .SendAsync("TicketCalled", notification);
           
            // Notificar grupo do departamento
            await hubContext.Clients.Group($"department_{ticket.Queue?.DepartmentId}")
                .SendAsync("TicketCalled", notification);

            logger.LogInformation("Notificação enviada para ticket {TicketCode}", ticket.TicketCode);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao enviar notificação de ticket chamado");
        }
    }

    public async Task NotifyTicketCreated(Ticket ticket, string queueName)
    {
        try
        {
            var notification = new
            {
                Type = "TicketCreated",
                TicketId = ticket.Id,
                TicketCode = ticket.TicketCode,
                QueueId = ticket.QueueId,
                QueueName = queueName,
                CreatedAt = ticket.CreatedAt,
                Message = $"Nova senha {ticket.TicketCode} gerada"
            };

            await hubContext.Clients.Group($"queue_{ticket.QueueId}")
                .SendAsync("TicketCreated", notification);

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao enviar notificação de ticket criado");
        }
    }

    public async Task NotifyQueueUpdate(int queueId, int currentSize, int maxSize)
    {
        try
        {
            var notification = new
            {
                Type = "QueueUpdated",
                QueueId = queueId,
                CurrentSize = currentSize,
                MaxSize = maxSize,
                UpdatedAt = DateTime.UtcNow
            };

            await hubContext.Clients.Group($"queue_{queueId}")
                .SendAsync("QueueUpdated", notification);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao enviar notificação de atualização da fila");
        }
    }
}

public interface INotificationService
{
    Task NotifyTicketCalled(Ticket ticket, string queueName, string departmentName);
    Task NotifyTicketCreated(Ticket ticket, string queueName);
    Task NotifyQueueUpdate(int queueId, int currentSize, int maxSize);
}