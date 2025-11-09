using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.Infrastructure.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace cronly_back.Infrastructure.Repositories;

public class DepartmentRepository (ApplicationDbContext context) : IDepartmentRepository
{
    public async Task<Department?> AddAsync(Department department, CancellationToken cancellationToken)
    {
       context.Departments.Add(department);

       await context.SaveChangesAsync(cancellationToken);
       
       return await context.Departments
           .AsNoTracking()
           .FirstOrDefaultAsync(x => x.Code == department.Code, 
               cancellationToken: cancellationToken);
    }

    public async Task<Department?> UpdateAsync(Department department, CancellationToken cancellationToken)
    {
        context.Departments.Update(department);
       
        await context.SaveChangesAsync(cancellationToken);
    
        return await context.Departments
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Code == department.Code, 
                cancellationToken);
    }

    public async Task<Department?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
       return await context.Departments
           .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Department?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await context.Departments
            .FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
    }

    public async Task<Department?> GetByCodeAsync(string code, CancellationToken cancellationToken)
    {
        return await context.Departments
            .FirstOrDefaultAsync(x => x.Code == code, cancellationToken);
    }

    public async Task<Department?> GetDuplicateDepartmentAsync(string name, string code, 
        CancellationToken cancellationToken)
    {
        return await context.Departments.
            Where(x => x.Name == name || x.Code == code)
            .FirstOrDefaultAsync(cancellationToken);   
    } 
    public async Task<List<Department>> GetAllAsync(CancellationToken cancellationToken)
    {
       return await context.Departments.ToListAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var department = await context.Departments
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        
        if (department is null)
            return false;
        
        context.Departments.Remove(department);
        await context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}