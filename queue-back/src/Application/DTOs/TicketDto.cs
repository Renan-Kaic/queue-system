using cronly_back.Domain.Enums;

namespace cronly_back.Application.DTOs;


public record CreateTicketRequest(int QueueId, int CitizenId, TicketPriority Priority);

public record UpdateTicketRequest(int Id, string TicketNumber, TicketStatus TicketStatus, TicketPriority Priority);

public record GetNextTicketRequest(int QueueId);
public record RecallLastTicketRequest(int QueueId);

public class TicketResponseDto
{
    public int Id { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public int QueueId { get; set; }
    public int CitizenId { get; set; }
    public TicketStatus TicketStatus { get; set; }
    public TicketPriority Priority { get; set; }
    public DateTime IssuedAt { get; set; }
    public DateTime? CalledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
}