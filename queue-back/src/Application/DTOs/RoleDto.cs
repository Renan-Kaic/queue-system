namespace cronly_back.Application.DTOs;

public record CreateRoleRequest (string Name);

public record AssignRoleToUserRequest (string UserId, string RoleId);

public record RemoveRoleRequest (string UserId, string RoleName);