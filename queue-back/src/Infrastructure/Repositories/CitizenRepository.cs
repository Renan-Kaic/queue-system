using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.Infrastructure.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace cronly_back.Infrastructure.Repositories;

public class CitizenRepository (ApplicationDbContext context) : ICitizenRepository
{
    public async Task<Citizen?> AddAsync(Citizen citizen, CancellationToken cancellationToken)
    {
        await context.Citizens.AddAsync(citizen, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        
        return await context.Citizens
                .AsNoTracking()
                .Where(x => x.Name == citizen.Name && x.Document == citizen.Document)
                .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Citizen?> UpdateAsync(Citizen citizen, CancellationToken cancellationToken)
    {
       context.Citizens.Update(citizen);
       
       await context.SaveChangesAsync(cancellationToken);
       
       return await context.Citizens
                .AsNoTracking()
                .Where(x => x.Name == citizen.Name && x.Document == citizen.Document)
                .FirstOrDefaultAsync(cancellationToken);
    }
    public async Task<Citizen?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await context.Citizens.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Citizen>> GetBtyNameAsync(string name, CancellationToken cancellationToken)
    {
        return await context.Citizens
            .AsNoTracking()
            .Where(x => x.Name == name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Citizen?> GetByDocumentAsync(string document, CancellationToken cancellationToken)
    {
       return await context.Citizens.
           FirstOrDefaultAsync(x => x.Document == document, cancellationToken);
    }

    public async Task<Citizen?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await context.Citizens.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }

    public async Task<List<Citizen>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await context.Citizens.ToListAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Citizen citizen, CancellationToken cancellationToken)
    {
        context.Citizens.Remove(citizen);
        var changes = await context.SaveChangesAsync(cancellationToken);

        return changes > 0;
    }
}