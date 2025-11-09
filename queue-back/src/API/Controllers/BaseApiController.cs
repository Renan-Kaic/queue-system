using cronly_back.shared;
using Microsoft.AspNetCore.Mvc;

namespace cronly_back.API.Controllers;

/// <summary>
/// Classe base para controllers da API com métodos auxiliares para respostas padronizadas
/// </summary>
[ApiController]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    /// <summary>
    /// Retorna uma resposta de sucesso (200 OK) com dados
    /// </summary>
    protected IActionResult OkResponse<T>(T data, string message = "Operação realizada com sucesso")
    {
        var response = ApiResponse<T>.Ok(data, message);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de sucesso (200 OK) sem dados
    /// </summary>
    protected IActionResult OkResponse(string message = "Operação realizada com sucesso")
    {
        var response = ApiResponse.OkMessage(message);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de criação (201 Created) com dados
    /// </summary>
    protected IActionResult CreatedResponse<T>(T data, string message = "Recurso criado com sucesso")
    {
        var response = ApiResponse<T>.Created(data, message);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta sem conteúdo (204 No Content)
    /// </summary>
    protected IActionResult NoContentResponse(string message = "Operação realizada com sucesso")
    {
        var response = ApiResponse.NoContentMessage(message);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de erro de validação (400 Bad Request) com lista de erros
    /// </summary>
    protected IActionResult BadRequestResponse(string message, List<string>? errors = null)
    {
        var response = ApiResponse.BadRequest(message, errors);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de erro de validação (400 Bad Request) com um único erro
    /// </summary>
    protected IActionResult BadRequestResponse(string message, string error)
    {
        var response = ApiResponse.BadRequest(message, error);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de não autorizado (401 Unauthorized)
    /// </summary>
    protected IActionResult UnauthorizedResponse(string message = "Não autorizado", List<string>? errors = null)
    {
        var response = ApiResponse.Unauthorized(message, errors);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de acesso negado (403 Forbidden)
    /// </summary>
    protected IActionResult ForbiddenResponse(string message = "Acesso negado", List<string>? errors = null)
    {
        var response = ApiResponse.Forbidden(message, errors);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de não encontrado (404 Not Found)
    /// </summary>
    protected IActionResult NotFoundResponse(string message, List<string>? errors = null)
    {
        var response = ApiResponse.NotFound(message, errors);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de conflito (409 Conflict)
    /// </summary>
    protected IActionResult ConflictResponse(string message, List<string>? errors = null)
    {
        var response = ApiResponse.Conflict(message, errors);
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Retorna uma resposta de erro interno (500 Internal Server Error)
    /// </summary>
    protected IActionResult InternalServerErrorResponse(string message = "Erro interno no servidor", List<string>? errors = null)
    {
        var response = ApiResponse.InternalServerError(message, errors);
        return StatusCode(response.StatusCode, response);
    }
}
