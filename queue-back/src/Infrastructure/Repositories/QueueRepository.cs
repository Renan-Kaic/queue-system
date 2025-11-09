using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.Infrastructure.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace cronly_back.Infrastructure.Repositories;

public class QueueRepository (ApplicationDbContext context) : IQueueRepository
{
    public async Task<Queue?> AddAsync(Queue queue, CancellationToken cancellationToken)
    {
       context.Queues.Add(queue);
       await context.SaveChangesAsync(cancellationToken);
       
       return await context.Queues
           .AsNoTracking()
           .FirstOrDefaultAsync(x => x.Name == queue.Name, 
               cancellationToken);
    }

    public async Task<Queue?> UpdateAsync(Queue queue, CancellationToken cancellationToken)
    {
        context.Queues.Update(queue);
        await context.SaveChangesAsync(cancellationToken);
        
        return await context.Queues
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == queue.Id, cancellationToken);   
    }

    public async Task<Queue?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await context.Queues
            .Include(x => x.Department)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
    
    public async Task<Queue?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await context.Queues
            .Include(x => x.Department)
            .FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
    }

    public async Task<Queue?> GetByCodeAsync(string code, CancellationToken cancellationToken)
    {
        return await context.Queues
            .Include(x => x.Department)
            .FirstOrDefaultAsync(x => x.Code == code, cancellationToken);
    }

    public async Task<Queue?> GetDuplicateInDepartmentAsync(string name, string code, int departmentId, CancellationToken cancellationToken)
    {
        return await context.Queues
            .Include(x => x.Department)
            .Where(x => x.Name == name || x.Code == code && x.DepartmentId == departmentId)
            .FirstOrDefaultAsync(cancellationToken);   
    } 
    public async Task<List<Queue>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await context.Queues
            .Include(x => x.Department)
            .ToListAsync(cancellationToken);   
    }

    public async Task<bool> DeleteAsync(Queue queue, CancellationToken cancellationToken)
    {
        context.Queues.Remove(queue);
        await context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}