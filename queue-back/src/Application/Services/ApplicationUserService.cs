using System.Security.Claims;
using cronly_back.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace cronly_back.Application.Services;

public class ApplicationUserService ( 
    SignInManager<ApplicationUser> signInManager,
    UserManager<ApplicationUser> userManager,
    ILogger<ApplicationUserService> logger)
{
    //public async Task<ApplicationUser> GetCurrentUserAsync() {}
    public async Task<ApplicationUser?> AuthenticateOrCreateUserAsync(ExternalLoginInfo info)
    {
        var signInResult = await signInManager.ExternalLoginSignInAsync(
            info.LoginProvider,
            info.ProviderKey,
            isPersistent: false,
            bypassTwoFactor: true
        );

        if (signInResult.Succeeded)
        {
            return await userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        }
        return await CreateUserAsync(info);
        
    }

    private async Task<ApplicationUser?> CreateUserAsync(ExternalLoginInfo info)
    {
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            logger.LogError("Email não encontrado nas claims do Google");
            return null;
        }
        var user = CreateUserFromClaims(info, email);
        var result = await userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            logger.LogError("Erro ao criar usuário: {Errors}", 
                string.Join(", ", result.Errors.Select(e => e.Description)));
            return null;
        }
            
        await userManager.AddLoginAsync(user, info);
        return user;
    }

    private static ApplicationUser CreateUserFromClaims(ExternalLoginInfo info, string email)
    {
        var fullName = info.Principal.FindFirstValue(ClaimTypes.Name);
        var givenName = info.Principal.FindFirstValue(ClaimTypes.GivenName);
        var surname = info.Principal.FindFirstValue(ClaimTypes.Surname);
        var pictureUrl = info.Principal.FindFirstValue("picture");
        
        var name = string.IsNullOrEmpty(fullName) ? $"{givenName} {surname}" : fullName;

        return new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FullName = name,
            GivenName = givenName,
            Surname = surname,
            ProfilePictureUrl = pictureUrl,
            CreatedAt = DateTime.UtcNow
        };
    }

    public async Task AssignAdminRoleAsync(ApplicationUser user)
    {
        var count =  userManager.Users.Count();
        if (count > 1) return;

        if (await userManager.IsInRoleAsync(user, "Admin")) return;
        
        var addRoleResult = await userManager.AddToRoleAsync(user, "Admin");
        if (!addRoleResult.Succeeded)
        {
            logger.LogWarning("Não foi possível adicionar role Admin ao primeiro usuário: {Errors}",
                string.Join(", ", addRoleResult.Errors.Select(e => e.Description)));
        }
    }
}