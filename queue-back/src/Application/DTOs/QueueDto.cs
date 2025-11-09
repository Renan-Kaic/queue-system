using cronly_back.Domain.Enums;

namespace cronly_back.Application.DTOs;

public record CreateQueueRequest(string Name, string Code, string? Description, 
    int MaxQueueSize, int DepartmentId, QueueStatus Status);
    
public record UpdateQueueRequest(int Id, string Name, string Code, string? Description, 
    int MaxQueueSize, int DepartmentId, QueueStatus Status);
