using cronly_back.Domain.Entities;

namespace cronly_back.Domain.Interfaces;

public interface ITicketRepository
{
    Task<Ticket?> AddAsync(Ticket ticket, CancellationToken cancellationToken);
    Task<Ticket?> UpdateAsync(Ticket ticket, CancellationToken cancellationToken);
    Task<Ticket?> GetNextWaitingTicketAsync(int queueId, CancellationToken cancellationToken);
    Task<Ticket?> GetLastCalledTicketAsync(int queueId, CancellationToken cancellationToken);

    Task<Ticket?> GetByCitizenIdAsync(int citizenId, CancellationToken cancellationToken);
    Task<Ticket?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<Ticket?> GetByCodeAsync(string code, CancellationToken cancellationToken);
    Task<Ticket?> GetDuplicateInQueueAsync(string ticketCode, int queueId, CancellationToken cancellationToken);
    Task<Ticket?> GetWaitingTicketForCitizenOnDateAsync(int citizenId, int queueId, CancellationToken cancellationToken);
    Task<List<Ticket>> GetAllAsync(CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Ticket ticket, CancellationToken cancellationToken);
}