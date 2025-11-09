using cronly_back.Domain.Entities;

namespace cronly_back.Domain.Interfaces;

public interface ICitizenRepository
{
    Task<Citizen?> AddAsync(Citizen citizen, CancellationToken cancellationToken);
    Task<Citizen?> UpdateAsync(Citizen citizen, CancellationToken cancellationToken);
    Task<Citizen?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<List<Citizen>> GetBtyNameAsync(string name, CancellationToken cancellationToken);
    Task<Citizen?> GetByDocumentAsync(string document, CancellationToken cancellationToken);
    Task<Citizen?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<List<Citizen>> GetAllAsync(CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Citizen citizen, CancellationToken cancellationToken);
}