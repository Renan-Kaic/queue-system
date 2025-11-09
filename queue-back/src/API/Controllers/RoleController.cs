using cronly_back.Application.DTOs;
using cronly_back.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace cronly_back.API.Controllers;

[Route("api/role/")]
[Authorize]
public class RoleController(
    RoleManager<IdentityRole> roleManager,
    UserManager<ApplicationUser> userManager,
    ILogger<RoleController> logger) : BaseApiController
{
    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
    {
        if (string.IsNullOrEmpty(request.Name))
        {
            return BadRequestResponse("Nome da role é obrigatório");
        }
        
        var roleExists = await roleManager.RoleExistsAsync(request.Name);
        if (roleExists)
        {
            return ConflictResponse(
                "Role já existe",
                [$"A role '{request.Name}' já está cadastrada no sistema."]
            );
        }

        try
        {
            var role = new IdentityRole(request.Name);
            var result = await roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                logger.LogInformation("Role {RoleName} criada com sucesso", request.Name);
                return CreatedResponse(new { id = role.Id, name = role.Name }, "Role criada com sucesso");
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequestResponse("Erro ao criar role", errors);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao criar role {RoleName}", request.Name);
            return InternalServerErrorResponse(
                "Erro ao criar role.",
                new List<string> { "Por favor, tente novamente mais tarde." }
            );
        }
    }

    [HttpGet("")]
    public IActionResult GetRoles()
    {
        try
        {
            var roles = roleManager.Roles.Select(r => new { r.Id, r.Name }).ToList();
            return OkResponse(roles, "Roles recuperadas com sucesso");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao buscar roles");
            return InternalServerErrorResponse(
                "Erro ao buscar roles.",
                new List<string> { "Por favor, tente novamente mais tarde." }
            );
        }
    }

    [HttpPost("assign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignRoleToUser([FromBody] AssignRoleToUserRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId) || string.IsNullOrEmpty(request.RoleId))
        {
            return BadRequestResponse(
                "Dados inválidos",
                new List<string> { "UserId e RoleId são obrigatórios." }
            );
        }

        try
        {
            var user = await userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFoundResponse(
                    "Usuário não encontrado.",
                    new List<string> { $"Nenhum usuário encontrado com o ID '{request.UserId}'." }
                );
            }
            
            var role = await roleManager.FindByIdAsync(request.RoleId);
            if (role?.Name == null)
            {
                return NotFoundResponse(
                    "Role não encontrada.",
                    new List<string> { $"Nenhuma role encontrada com o ID '{request.RoleId}'." }
                );
            }

            var result = await userManager.AddToRoleAsync(user, role.Name);
            if (result.Succeeded)
            {
                logger.LogInformation("Role {RoleName} atribuída ao usuário {UserId}", role.Name, user.Id);
                return OkResponse(
                    new { userId = user.Id, roleName = role.Name },
                    "Role atribuída com sucesso"
                );
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequestResponse("Erro ao atribuir role", errors);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao atribuir role ao usuário {UserId}", request.UserId);
            return InternalServerErrorResponse(
                "Erro ao atribuir role.",
                new List<string> { "Por favor, tente novamente mais tarde." }
            );
        }
    }

    [HttpDelete("remove")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RemoveRoleFromUser([FromBody] RemoveRoleRequest request)
    {
        try
        {
            var user = await userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFoundResponse(
                    "Usuário não encontrado",
                    new List<string> { $"Nenhum usuário encontrado com o ID '{request.UserId}'." }
                );
            }

            var result = await userManager.RemoveFromRoleAsync(user, request.RoleName);
            if (result.Succeeded)
            {
                logger.LogInformation("Role {RoleName} removida do usuário {UserId}", request.RoleName, user.Id);
                return OkResponse(
                    new { userId = user.Id, roleName = request.RoleName },
                    "Role removida com sucesso"
                );
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequestResponse("Erro ao remover role", errors);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao remover role {RoleName} do usuário {UserId}", request.RoleName, request.UserId);
            return InternalServerErrorResponse(
                "Erro ao remover role.",
                new List<string> { "Por favor, tente novamente mais tarde." }
            );
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserRoles(string userId)
    {
        try
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFoundResponse(
                    "Usuário não encontrado",
                    new List<string> { $"Nenhum usuário encontrado com o ID '{userId}'." }
                );
            }

            var roles = await userManager.GetRolesAsync(user);
            return OkResponse(roles, "Roles do usuário recuperadas com sucesso");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao buscar roles do usuário {UserId}", userId);
            return InternalServerErrorResponse(
                "Erro ao buscar roles do usuário.",
                new List<string> { "Por favor, tente novamente mais tarde." }
            );
        }
    }
}