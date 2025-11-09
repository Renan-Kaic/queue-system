using System.Collections.Concurrent;

namespace cronly_back.API.Middlewares;

public class RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
{
    private static readonly ConcurrentDictionary<string, (DateTime FirstRequest, int Count)> _requestCounts = new();
    private const int MaxRequestsPerMinute = 10;

    public async Task InvokeAsync(HttpContext context)
    {
        // Aplica rate limiting apenas em rotas de atualização
        if (context.Request.Method == "PUT" && context.Request.Path.StartsWithSegments("/user/profile"))
        {
            var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (!string.IsNullOrEmpty(userId))
            {
                var key = $"{userId}:{context.Request.Path}";
                var now = DateTime.UtcNow;

                var (firstRequest, count) = _requestCounts.GetOrAdd(key, (now, 0));

                // Limpa contador se passou 1 minuto
                if ((now - firstRequest).TotalMinutes >= 1)
                {
                    _requestCounts[key] = (now, 1);
                }
                else
                {
                    if (count >= MaxRequestsPerMinute)
                    {
                        logger.LogWarning("Rate limit excedido para usuário {UserId}", userId);
                        context.Response.StatusCode = 429; // Too Many Requests
                        await context.Response.WriteAsJsonAsync(new
                        {
                            success = false,
                            message = "Muitas requisições. Tente novamente em alguns instantes.",
                            details = "Rate limit excedido."
                        });
                        return;
                    }

                    _requestCounts[key] = (firstRequest, count + 1);
                }
            }
        }

        await next(context);
    }
}