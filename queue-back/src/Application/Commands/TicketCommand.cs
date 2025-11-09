using cronly_back.Domain.Enums;

namespace cronly_back.Application.Commands;

public class CreateTicketCommand
{
    public int QueueId { get; set; }
    public int CitizenId { get; set; }
    public TicketPriority Priority { get; set; } = TicketPriority.Normal;
}

public class UpdateTicketCommand
{
    public int Id { get; set; }
    public string TicketNumber { get; set; } = string.Empty;
    public TicketStatus TicketStatus { get; set; }
    public TicketPriority Priority { get; set; }
}

public record DeleteTicketCommand(int Id);

public record GetTicketByIdCommand(int Id);
public record GetNextTicketCommand(int QueueId);
public record GetLastTicketCommand(int QueueId);

public record GetAllTicketsCommand();