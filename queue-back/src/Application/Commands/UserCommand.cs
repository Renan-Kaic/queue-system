namespace cronly_back.Application.Commands;

public record GetAllUsersCommand ();
public record UpdateUserProfileCommand
{
    public string UserId { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public string? ProfilePictureUrl { get; init; }
}