namespace cronly_back.Application.Commands;

using cronly_back.Domain.Enums;

public class CreateQueueCommand
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MaxQueueSize { get; set; }
    public int DepartmentId { get; set; }
    public QueueStatus Status { get; set; }
}

public record DeleteQueueCommand(int Id);
public record GetAllQueuesCommand();
public record GetQueueByIdCommand(int Id);

public class UpdateQueueCommand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MaxQueueSize { get; set; }
    public int DepartmentId { get; set; }
    public QueueStatus Status { get; set; }
}