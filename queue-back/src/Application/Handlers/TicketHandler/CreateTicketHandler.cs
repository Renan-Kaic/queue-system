using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.TicketHandler;

public class CreateTicketHandler
{
    public async Task<ApiResponse<Ticket?>> Handle(
        CreateTicketCommand command,
        ITicketRepository repository,
        ICitizenRepository citizenRepository,
        IDepartmentRepository departmentRepository,
        IQueueRepository queueRepository,
        CancellationToken cancellationToken)
    {
        try
        {
            var queue = await queueRepository.GetByIdAsync(command.QueueId, cancellationToken);
            
            if (queue is null)
            {
                return ApiResponse<Ticket?>.NotFound("Fila não encontrada.");
            }

            if (queue.Status != QueueStatus.Active)
            {
                return ApiResponse<Ticket?>
                    .BadRequest("Fila inativa. Para criar uma senha e preciso que a fila esteja ativa.");
            }
            
            var citizen = await citizenRepository.GetByIdAsync(command.CitizenId, cancellationToken);
            if (citizen is null)
            {
                return ApiResponse<Ticket?>.NotFound("Cidadão não encontrado.");
            }
            
            var existingTicketForDay = await repository.GetWaitingTicketForCitizenOnDateAsync(
                command.CitizenId,
                command.QueueId,
                cancellationToken);

            if (existingTicketForDay is not null)
            {
                return ApiResponse<Ticket?>.Conflict(
                    "Senha duplicada",
                    ["Já existe uma senha em espera para o mesmo dia e fila para este cidadão."]
                );
            }
            
            if (queue.CurrentQueueSize >= queue.MaxQueueSize)
            {
                return ApiResponse<Ticket?>.BadRequest(
                    "Fila cheia",
                    [$"A fila atingiu o limite máximo de {queue.MaxQueueSize} senhas."]
                );
            }
            var department = await departmentRepository.GetByIdAsync(queue.DepartmentId, cancellationToken);
            var ticketNumber = queue.CurrentQueueSize + 1;
            var ticketCode = $"{department!.Code}{queue.Code}-{ticketNumber:D3}";
            
            var existingTicket = await repository.GetByCodeAsync(ticketCode, cancellationToken);
            if (existingTicket is not null)
            {
                var allTickets = await repository.GetAllAsync(cancellationToken);
                var ticketsInQueue = allTickets
                    .Where(t => t.QueueId == queue.Id && t.CreatedAt.Date == DateTime.UtcNow.Date)
                    .ToList();
                
                ticketNumber = ticketsInQueue.Count + 1;
                ticketCode = $"{queue.Code}-{ticketNumber:D3}";
            }
            
            var ticket = new Ticket(
                ticketCode: ticketCode,
                queueId: command.QueueId,
                citizenId: command.CitizenId,
                ticketStatus: TicketStatus.Waiting,
                priority: command.Priority
            );
            
            var createdTicket = await repository.AddAsync(ticket, cancellationToken);
            
            if (createdTicket is null)
            {
                return ApiResponse<Ticket?>.InternalServerError(
                    "Erro ao criar a senha",
                    ["Não foi possível salvar a senha no banco de dados."]
                );
            }
            
            queue.CurrentQueueSize++;
            await queueRepository.UpdateAsync(queue, cancellationToken);
            
            return ApiResponse<Ticket?>.Created(createdTicket, "Senha criada com sucesso.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}