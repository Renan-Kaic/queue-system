using cronly_back.Domain.Enums;

namespace cronly_back.Application.DTOs;

public record CreateCitizenRequest(string Name, string? Document, 
    string? Email, string? Phone, CitizenType Type);
    
public record UpdateCitizenRequest(int Id, string Name, string? Document, 
    string? Email, string? Phone, CitizenType Type);