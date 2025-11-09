using cronly_back.Domain.Enums;

namespace cronly_back.Application.Commands;

public record CreateDepartmentCommand
{
    public string Name { get; set; } 
    public string Code { get; set; } 
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public DepartmentStatus Status { get; set; }
}

public record GetAllDepartmentsCommand();
public record GetDepartmentByIdCommand(int Id);
public record DeleteDepartmentCommand(int Id);

public record UpdateDepartmentCommand
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public string Code { get; set; } 
    public string? Description { get; set; }
    public int Capacity { get; set; }
    public DepartmentStatus Status { get; set; }
};