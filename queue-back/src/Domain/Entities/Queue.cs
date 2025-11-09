using cronly_back.Domain.Enums;
using ImTools;

namespace cronly_back.Domain.Entities;

public class Queue
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public int CurrentQueueSize { get; set; } = 0;
    public string Code { get; set; } = string.Empty;
    public int MaxQueueSize { get; set; } = 1;
    public int DepartmentId { get; set; }
    public QueueStatus Status { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Department Department { get; set; }
    
    public ICollection<Ticket> Tickets { get; set; }
  
    public Queue(){}
    
    public Queue(string name, string code, string description, 
        int maxQueueSize, int departmentId, QueueStatus status)
    {
        Name = name;
        Code = code;      
        Description = description;
        MaxQueueSize = maxQueueSize;
        DepartmentId = departmentId;
        Status = status;
        CreatedAt = DateTime.UtcNow;   
    }

    public void Update (string name, string code, string description, 
        int maxQueueSize, int departmentId, QueueStatus status)
    {
        Name = name;
        Code = code;     
        Description = description;
        MaxQueueSize = maxQueueSize;
        DepartmentId = departmentId;
        Status = status;
        UpdatedAt = DateTime.UtcNow;   
    }
}