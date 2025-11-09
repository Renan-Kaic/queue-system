using cronly_back.Domain.Enums;

namespace cronly_back.Domain.Entities;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public int Capacity { get; set; } = 1;
    public DepartmentStatus Status { get; set; } = DepartmentStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public ICollection<Queue> Queues { get; set; } = new List<Queue>();
    
    public Department(){}
    
    public Department(string name, string code, string description, int capacity, DepartmentStatus status)
    {
        Name = name;
        Code = code;       
        Description = description;
        Capacity = capacity;
        Status = status;
        CreatedAt = DateTime.UtcNow;   
    }

    public void Update(string name, string code, string? description, int capacity, DepartmentStatus status)
    {
        Name = name;
        Code = code;      
        Description = description;
        Capacity = capacity;
        Status = status;
        UpdatedAt = DateTime.UtcNow;  
    }
}