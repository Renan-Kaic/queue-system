using cronly_back.API.Extensions;
using cronly_back.API.Filters;
using cronly_back.API.Hubs;
using cronly_back.API.Middlewares;
using cronly_back.Application.Services;
using cronly_back.Application.Validators;
using cronly_back.Infrastructure.Data.Contexts;
using cronly_back.shared;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace cronly_back;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");


        builder.Services.AddControllers(options =>
        {
            options.Filters.Add<AuthorizationFilter>();
            options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
        });


        builder.Services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState
                    .Where(entry => entry.Value?.Errors.Count > 0)
                    .SelectMany(entry => entry.Value!.Errors.Select(err => err.ErrorMessage))
                    .Distinct()
                    .ToList();

                var response = ApiResponse.BadRequest("Dados inválidos.", errors);

                return new ObjectResult(response)
                {
                    StatusCode = response.StatusCode
                };
            };
        });

        // Configurar serviços
        builder.Services.AddDatabase(connectionString);
        builder.Host.AddWolverineMessaging(connectionString);
        builder.Services.AddJwtAuthentication(builder.Configuration);
        builder.Services.AddCorsPolicy(builder.Configuration);

        // Services
        builder.Services.AddScoped<TokenService>();
        builder.Services.AddScoped<ApplicationUserService>();
        builder.Services.AddScoped<RoleSeederService>();
        builder.Services.AddScoped<INotificationService, NotificationService>();

        // SignalR
        builder.Services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true; // Para desenvolvimento - remover em produção
        });
        builder.Services.AddHttpContextAccessor();

        // API
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddFluentValidationAutoValidation();
        builder.Services.AddFluentValidationClientsideAdapters();
        builder.Services.AddValidatorsFromAssemblyContaining<CreateCitizenRequestValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<UpdateCitizenRequestValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreateDepartmentValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<UpdateDepartmentValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreateQueueValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<UpdateQueueValidator>();
    builder.Services.AddValidatorsFromAssemblyContaining<CreateTicketValidator>();
    builder.Services.AddValidatorsFromAssemblyContaining<UpdateTicketValidator>();
        //builder.Services.AddValidatorsFromAssemblyContaining<>();

        var app = builder.Build();

        // Configurar pipeline
        ConfigureMiddleware(app);

        await SeedAsync(app);
        await app.RunAsync();
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("NextJsPolicy");
        app.UseMiddleware<ApiResponseMiddleware>();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.MapHub<TicketHub>("/ticket-hub");
    }

    private static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var roleSeeder = scope.ServiceProvider.GetRequiredService<RoleSeederService>();
        await roleSeeder.SeedAsync();
    }

}