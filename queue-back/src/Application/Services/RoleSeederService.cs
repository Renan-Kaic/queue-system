using cronly_back.Infrastructure.Data.Contexts;
using Microsoft.AspNetCore.Identity;

namespace cronly_back.Application.Services;

public class RoleSeederService (RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
{
    public async Task SeedAsync()
    {
        var roles = new[] { "Admin", "Manager", "Teacher", "User", "Committee_member", "Department_head" };
        
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}