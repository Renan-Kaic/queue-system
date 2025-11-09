using cronly_back.Domain.Enums;

namespace cronly_back.Domain.Entities;

public class Citizen
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Document { get; set; }  = string.Empty;
    public string? Email { get; set; }  = string.Empty;
    public string? Phone { get; set; } = string.Empty;
    public CitizenType Type { get; set; } = CitizenType.Normal;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    
    public Citizen(){}

    public Citizen(string name, string document, string email, string phone, CitizenType type)
    {
        Name = name;
        Document = document;
        Email = email;
        Phone = phone;
        Type = type;
        CreatedAt = DateTime.UtcNow;
    }
    
    public void Update(string name, string? document, string? email, string? phone, CitizenType type)
    {
        Name = name;
        Document = document;
        Email = email;
        Phone = phone;
        Type = type;
        UpdatedAt = DateTime.UtcNow;      
    }
}