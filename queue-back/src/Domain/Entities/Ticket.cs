using cronly_back.Domain.Enums;

namespace cronly_back.Domain.Entities;

public class Ticket
{
    public int Id { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public int QueueId { get; set; }
    public int CitizenId { get; set; }
    public TicketStatus TicketStatus { get; set; } = TicketStatus.Waiting;
    public TicketPriority Priority { get; set; } = TicketPriority.Normal;
    
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CalledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Queue Queue { get; set; } = null!;
    public Citizen Citizen { get; set; } = null!;
    
    public Ticket(){}
    
    public Ticket(string ticketCode, int queueId, int citizenId, TicketStatus ticketStatus, TicketPriority priority)
    {
        TicketCode = ticketCode;
        QueueId = queueId;
        CitizenId = citizenId;
        TicketStatus = ticketStatus;
        Priority = priority;
        CreatedAt = DateTime.UtcNow;   
        IssuedAt = DateTime.UtcNow;   
    }
    
    public void Update(string ticketNumber, TicketStatus ticketStatus, TicketPriority priority)
    {
        TicketCode = ticketNumber;
        TicketStatus = ticketStatus;
        Priority = priority;
        UpdatedAt = DateTime.UtcNow;   
    }
}