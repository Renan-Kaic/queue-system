using cronly_back.Domain.Enums;

namespace cronly_back.Application.Commands;

public class CreateCitizenCommand
{
    public string Name { get; set; } = string.Empty;
    public string? Document { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public CitizenType Type { get; set; }
}

public record UpdateCitizenCommand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Document { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public CitizenType Type { get; set; }
}

public record GetCitizenByIdCommand(int Id);

public record GetAllCitizensCommand;

public record DeleteCitizenCommand(int Id);
