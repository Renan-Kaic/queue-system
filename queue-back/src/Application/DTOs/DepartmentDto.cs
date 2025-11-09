using cronly_back.Domain.Enums;

namespace cronly_back.Application.DTOs;

public record CreateDepartmentRequest (string Name, string Code, 
    string? Description,  int Capacity, DepartmentStatus Status);
public record UpdateDepartmentRequest(int Id, string Name, string Code, 
        string? Description, int Capacity, DepartmentStatus Status);