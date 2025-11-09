using cronly_back.Application.DTOs;
using cronly_back.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace cronly_back.Application.Mappings;

public static class UserMappingExtensions
{
    public static async Task<UserResponse> ToUserResponseAsync(
        this ApplicationUser user, 
        UserManager<ApplicationUser> userManager)
    {
        var roles = await userManager.GetRolesAsync(user);
        

        return new UserResponse(
            Id: user.Id,
            FullName: user.FullName,
            GivenName: user.GivenName,
            Surname: user.Surname,
            ProfilePictureUrl: user.ProfilePictureUrl,
            UserName: user.UserName,
            Email: user.Email,
            EmailConfirmed: user.EmailConfirmed,
            PhoneNumber: user.PhoneNumber,
            PhoneNumberConfirmed: user.PhoneNumberConfirmed,
            UserRoles: roles.ToArray(),
            CreatedAt: user.CreatedAt,
            UpdatedAt: user.UpdatedAt
        );
    }

    public static UserResponse ToUserResponse(this ApplicationUser user, string[] roles, string[] departmentMemberships)
    {
        return new UserResponse(
            Id: user.Id,
            FullName: user.FullName,
            GivenName: user.GivenName,
            Surname: user.Surname,
            ProfilePictureUrl: user.ProfilePictureUrl,
            UserName: user.UserName,
            Email: user.Email,
            EmailConfirmed: user.EmailConfirmed,
            PhoneNumber: user.PhoneNumber,
            PhoneNumberConfirmed: user.PhoneNumberConfirmed,
            UserRoles: roles,
            CreatedAt: user.CreatedAt,
            UpdatedAt: user.UpdatedAt
        );
    }
}