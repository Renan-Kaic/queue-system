using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace cronly_back.API.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtKey = configuration["Jwt:Key"] 
            ?? throw new InvalidOperationException("JWT Key não configurada.");

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Primeiro tenta pegar o token do cookie
                        var token = context.Request.Cookies["auth_token"];
                        
                        // Se não tiver no cookie, tenta pegar da query string (para SignalR)
                        if (string.IsNullOrEmpty(token) && context.Request.Path.StartsWithSegments("/ticket-hub"))
                        {
                            token = context.Request.Query["access_token"];
                        }
                        
                        // Se não tiver na query string, tenta pegar do header Authorization
                        if (string.IsNullOrEmpty(token))
                        {
                            var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
                            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                            {
                                token = authHeader["Bearer ".Length..];
                            }
                        }

                        if (!string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }
                        return Task.CompletedTask;
                    }
                };
            })
            .AddGoogle(options =>
            {
                var clientId = configuration["Google:ClientId"] 
                    ?? throw new InvalidOperationException("Google ClientId não configurado.");
                var clientSecret = configuration["Google:ClientSecret"]
                    ?? throw new InvalidOperationException("Google ClientSecret não configurado.");
                
                options.Scope.Add("profile");
                options.Events.OnCreatingTicket = async context =>
                {
                    var picture = context.User.GetProperty("picture").GetString();
            
                    if (!string.IsNullOrEmpty(picture))
                    {
                        context.Identity?.AddClaim(new Claim("picture", picture));
                    }
                };
                
                options.ClientId = clientId;
                options.ClientSecret = clientSecret;
            
                options.CorrelationCookie.SameSite = SameSiteMode.Lax;
                options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                options.CorrelationCookie.HttpOnly = true;
            });

        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.Name = "auth_token";
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Lax;
            options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
            options.ExpireTimeSpan = TimeSpan.FromHours(24);
            options.SlidingExpiration = true;

            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };

            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        services.AddAuthorization();
        
        return services;
    }
}