using System.Security.Claims;
using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Application.Mappings;
using cronly_back.Application.Services;
using cronly_back.Domain.Entities;
using cronly_back.shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace cronly_back.API.Controllers;

[Route("user/")]
public class UserController(
    ILogger<UserController> logger,
    IConfiguration configuration,
    SignInManager<ApplicationUser> signInManager,
    UserManager<ApplicationUser> userManager,
    TokenService tokenService,
    ApplicationUserService userService,
    IWebHostEnvironment env,
    IMessageBus messageBus) : BaseApiController
{
    [HttpGet("")]
    [AllowAnonymous]
    public IActionResult Get()
    {
        try
        {
            var redirectUrl = Url.Action(nameof(GoogleCallback), "User");
            var properties = signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            return new ChallengeResult("Google", properties);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao iniciar autenticação com Google");
            return InternalServerErrorResponse(
                "Ocorreu um erro interno no servidor.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        try
        {
            var frontUrl = configuration["utils:frontUrl"];
            if (string.IsNullOrEmpty(frontUrl))
            {
                return InternalServerErrorResponse(
                    "Configuração inválida do servidor.",
                    ["Por favor, entre em contato com o suporte."]
                );
            }
            var info = await signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return BadRequestResponse("Ocorreu um erro ao obter informações de login.");
            }
            
            var user = await userService.AuthenticateOrCreateUserAsync(info);
           if (user == null)
            {
                return BadRequestResponse("Ocorreu um erro ao criar o usuário.");
            }
            
            var jwtToken = await tokenService.GenerateAccessToken(user);
            Response.Cookies.Append("auth_token", jwtToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !env.IsDevelopment(),
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddHours(24),
                Path = "/",
                IsEssential = true
            });
            
            await userService.AssignAdminRoleAsync(user);

            var usersCount = userManager.Users.Count();

            var redirectPath = "/app";;
            
            return Redirect($"{frontUrl}{redirectPath}");
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro no callback do Google");
            return InternalServerErrorResponse(
                "Ocorreu um erro durante a autenticação.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }
    /*
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> Profile()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
          
            return OkResponse(
                new
                {
                    isAuthenticated = true, null
                },
                "Usuário autenticado com sucesso."
            );

        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao verificar autenticação do usuário");
            return InternalServerErrorResponse(
                "Erro ao verificar autenticação.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }*/

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return UnauthorizedResponse(
                    "Usuário não autenticado.",
                    ["Token inválido ou expirado."]
                );
            }
           
            var command = new UpdateUserProfileCommand
            {
                UserId = userId,
                FullName = Utils.SanitizeInput(request.Name)!,
                PhoneNumber = Utils.SanitizeInput(request.Phone)!,
                ProfilePictureUrl = Utils.SanitizeInput(request.ProfilePictureUrl)
            };

            var userResponse = await messageBus.InvokeAsync<UserResponse>(command);

            logger.LogInformation("Perfil atualizado com sucesso para o usuário {UserId}", userId);

            return OkResponse(
                userResponse,
                "Perfil atualizado com sucesso."
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro inesperado ao atualizar perfil do usuário");
            
            return InternalServerErrorResponse(
                "Erro interno no servidor.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin, Manager, Teacher, Committee_member, Department_head")]
    public async Task<IActionResult> ListUsers()
    {
        var command = new GetAllUsersCommand();
        var response = await messageBus.InvokeAsync<ApiResponse<IList<UserResponse>>>(command);
        
        return StatusCode(response.StatusCode, response);
    }
    
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Redirect("/");
    }
    
}
