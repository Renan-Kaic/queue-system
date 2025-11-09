using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Application.Mappings;
using cronly_back.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace cronly_back.Application.Handlers.UserHandler;

public class UpdateUserProfileHandler(
    UserManager<ApplicationUser> userManager,
    ILogger<UpdateUserProfileHandler> logger)
{
    public async Task<UserResponse> Handle(UpdateUserProfileCommand command)
    {
        var user = await userManager.FindByIdAsync(command.UserId);

        if (user == null)
        {
            logger.LogWarning("Tentativa de atualizar usuário inexistente: {UserId}", command.UserId);
            throw new UnauthorizedAccessException("Usuário não encontrado.");
        }

        user.FullName = command.FullName;
        user.ProfilePictureUrl = command.ProfilePictureUrl;
        user.PhoneNumber = command.PhoneNumber;
        user.UpdatedAt = DateTime.UtcNow;

        var result = await userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            return await user.ToUserResponseAsync(userManager);
        }

        var errors = string.Join(", ", result.Errors.Select(e => e.Description));
        logger.LogError("Erro ao atualizar usuário {UserId}: {Errors}", command.UserId, errors);
        throw new InvalidOperationException($"Erro ao atualizar perfil: {errors}");

    }
}