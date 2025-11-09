namespace cronly_back.Application.DTOs;

public record UserDto();

public record UserResponse(
    string Id,
    string? FullName,
    string? GivenName,
    string? Surname,
    string? ProfilePictureUrl,
    string? UserName,
    string? Email,
    bool EmailConfirmed,
    string? PhoneNumber,
    bool PhoneNumberConfirmed,
    string[] UserRoles,
    DateTime CreatedAt,
    DateTime? UpdatedAt
    );
    
    
public record UpdateUserRequest(
    string Name, string Phone, string? ProfilePictureUrl
    );