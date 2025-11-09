using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using cronly_back.Domain.Interfaces;
using cronly_back.Infrastructure.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace cronly_back.Infrastructure.Repositories;

public class TicketRepository (ApplicationDbContext context) : ITicketRepository
{
    public async Task<Ticket?> AddAsync(Ticket ticket, CancellationToken cancellationToken)
    {
        context.Tickets.Add(ticket);
        await context.SaveChangesAsync(cancellationToken);

        return await context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == ticket.Id, cancellationToken);
    }

    public async Task<Ticket?> GetNextWaitingTicketAsync(int queueId, CancellationToken cancellationToken)
    {
        var startOfDay = DateTime.UtcNow.Date; 
        var endOfDay = startOfDay.AddDays(1);  
            
        return await context.Tickets
            .AsNoTracking()
            .Where(x => x.QueueId == queueId 
                        && x.TicketStatus == TicketStatus.Waiting
                        && x.CreatedAt >= startOfDay
                        && x.CreatedAt < endOfDay)
            .OrderByDescending(x => x.Priority)
            .ThenBy(x => x.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Ticket?> GetLastCalledTicketAsync(int queueId, CancellationToken cancellationToken)
    {
        var startOfDay = DateTime.UtcNow.Date; 
        var endOfDay = startOfDay.AddDays(1);  
            
        return await context.Tickets
            .AsNoTracking()
            .Where(x => x.QueueId == queueId 
                        && x.TicketStatus == TicketStatus.Called
                        && x.CreatedAt >= startOfDay
                        && x.CreatedAt < endOfDay)
            .OrderByDescending(x => x.Priority)
            .ThenBy(x => x.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }


    public async Task<Ticket?> GetByCitizenIdAsync(int citizenId, CancellationToken cancellationToken)
    {
        return await context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.CitizenId == citizenId, cancellationToken);
    }
    
    public async Task<Ticket?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
    
    public async Task<Ticket?> GetByCodeAsync(string ticketCode, CancellationToken cancellationToken)
    {
        return await context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TicketCode == ticketCode, cancellationToken);
    }
    
    public async Task<Ticket?> UpdateAsync(Ticket ticket, CancellationToken cancellationToken)
    {
        context.Tickets.Update(ticket);
        await context.SaveChangesAsync(cancellationToken);

        return await context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == ticket.Id, cancellationToken);
    }

    public async Task<Ticket?> GetDuplicateInQueueAsync(string ticketCode, 
        int queueId, CancellationToken cancellationToken)
    {
        return await context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TicketCode == ticketCode && x.QueueId == queueId, cancellationToken);
    }

    public async Task<Ticket?> GetWaitingTicketForCitizenOnDateAsync(int citizenId, int queueId,
        CancellationToken cancellationToken)
    {
        var startOfDay = DateTime.UtcNow.Date; 
        var endOfDay = startOfDay.AddDays(1);  

        return await context.Tickets
            .AsNoTracking()
            .Where(x => x.CitizenId == citizenId
                        && x.QueueId == queueId
                        && x.TicketStatus == TicketStatus.Waiting
                        && x.CreatedAt >= startOfDay
                        && x.CreatedAt < endOfDay)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Ticket>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await context.Tickets
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Ticket ticket, CancellationToken cancellationToken)
    {
        context.Tickets.Remove(ticket);
        var changes = await context.SaveChangesAsync(cancellationToken);

        return changes > 0;
    }
}