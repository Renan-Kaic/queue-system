using cronly_back.shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace cronly_back.API.Filters;

public class AuthorizationFilter : IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        switch (context.Result)
        {
            case ForbidResult:
            {
                var response = ApiResponse.Forbidden(
                    "Acesso negado",
                    ["Você não tem permissão para acessar este recurso."]
                );
                context.Result = new ObjectResult(response) { StatusCode = 403 };
                break;
            }
            case ChallengeResult:
            {
                var response = ApiResponse.Unauthorized(
                    "Não autorizado",
                    ["Token inválido ou expirado."]
                );
                context.Result = new ObjectResult(response) { StatusCode = 401 };
                break;
            }
        }
    }
}