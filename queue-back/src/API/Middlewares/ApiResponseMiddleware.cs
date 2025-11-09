using System.Text.Json;
using cronly_back.shared;

namespace cronly_back.API.Middlewares;

public class ApiResponseMiddleware (RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var originalBodyStream = context.Response.Body;

        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        await next(context);

        if (context.Response.StatusCode is 401 or 403 
            && context.Response.ContentType?.Contains("application/json") != true)
        {
            context.Response.Body = originalBodyStream;
            context.Response.ContentType = "application/json";

            var response = context.Response.StatusCode switch
            {
                401 => ApiResponse.Unauthorized(
                    "Não autorizado",
                    ["Token inválido ou expirado."]
                ),
                403 => ApiResponse.Forbidden(
                    "Acesso negado",
                    ["Você não tem permissão para acessar este recurso."]
                ),
                _ => ApiResponse.InternalServerError("Erro desconhecido")
            };

            var json = JsonSerializer.Serialize(response, Options);

            await context.Response.WriteAsync(json);
        }
        else
        {
            responseBody.Seek(0, SeekOrigin.Begin);
            await responseBody.CopyToAsync(originalBodyStream);
        }
    }
    
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
}