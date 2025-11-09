using cronly_back.Domain.Entities;

namespace cronly_back.Domain.Interfaces;

public interface IQueueRepository
{
    Task<Queue?> AddAsync(Queue queue, CancellationToken cancellationToken);
    Task<Queue?> UpdateAsync(Queue queue, CancellationToken cancellationToken);
    Task<Queue?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<Queue?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task<Queue?> GetByCodeAsync(string code, CancellationToken cancellationToken);
    Task<Queue?> GetDuplicateInDepartmentAsync(string name, string code, int departmentId, CancellationToken cancellationToken);
    Task<List<Queue>> GetAllAsync(CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Queue queue, CancellationToken cancellationToken);
}