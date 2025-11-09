using cronly_back.Domain.Entities;

namespace cronly_back.Domain.Interfaces;

public interface IDepartmentRepository
{
    Task<Department?> AddAsync(Department department, CancellationToken cancellationToken);
    Task<Department?> UpdateAsync(Department department, CancellationToken cancellationToken);
    Task<Department?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<Department?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task<Department?> GetByCodeAsync(string code, CancellationToken cancellationToken);
    Task<Department?> GetDuplicateDepartmentAsync(string name, string code, CancellationToken cancellationToken);
    Task<List<Department>> GetAllAsync(CancellationToken cancellationToken);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}