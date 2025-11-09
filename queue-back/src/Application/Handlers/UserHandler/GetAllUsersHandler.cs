using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Application.Mappings;
using cronly_back.Domain.Entities;
using cronly_back.shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace cronly_back.Application.Handlers.UserHandler;

public class GetAllUsersHandler(UserManager<ApplicationUser> userManager)
{
    public async Task<ApiResponse<IList<UserResponse>>> Handle(GetAllUsersCommand command,
        CancellationToken cancellationToken)
    {
        
        return ApiResponse<IList<UserResponse>>.Ok(new List<UserResponse>());
    }
}