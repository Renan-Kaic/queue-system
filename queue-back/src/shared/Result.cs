using System.Net;

namespace cronly_back.shared;

/// <summary>
/// Representa uma resposta padronizada da API com dados tipados
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
    public int StatusCode { get; set; }
    public DateTime Timestamp { get; set; }

    protected ApiResponse() 
    { 
        Timestamp = DateTime.UtcNow;
    }

    protected ApiResponse(bool success, string message, T? data = default, List<string>? errors = null, int statusCode = 200)
    {
        Success = success;
        Message = message;
        Data = data;
        Errors = errors;
        StatusCode = statusCode;
        Timestamp = DateTime.UtcNow;
    }

    /// <summary>
    /// Cria uma resposta de sucesso com dados (200 OK)
    /// </summary>
    public static ApiResponse<T> Ok(T data, string message = "Operação realizada com sucesso")
        => new(true, message, data, null, 200);

    /// <summary>
    /// Cria uma resposta de sucesso para criação (201 Created)
    /// </summary>
    public static ApiResponse<T> Created(T data, string message = "Recurso criado com sucesso")
        => new(true, message, data, null, 201);

    /// <summary>
    /// Cria uma resposta de sucesso sem conteúdo (204 No Content)
    /// </summary>
    public static ApiResponse<T> NoContent(string message = "Operação realizada com sucesso")
        => new(true, message, default, null, 204);

    /// <summary>
    /// Cria uma resposta de erro de validação (400 Bad Request)
    /// </summary>
    public static ApiResponse<T> BadRequest(string message, List<string>? errors = null)
        => new(false, message, default, errors, 400);

    /// <summary>
    /// Cria uma resposta de erro de validação com erro único
    /// </summary>
    public static ApiResponse<T> BadRequest(string message, string error)
        => new(false, message, default, new List<string> { error }, 400);

    /// <summary>
    /// Cria uma resposta de não autorizado (401 Unauthorized)
    /// </summary>
    public static ApiResponse<T> Unauthorized(string message = "Não autorizado", List<string>? errors = null)
        => new(false, message, default, errors, 401);

    /// <summary>
    /// Cria uma resposta de acesso negado (403 Forbidden)
    /// </summary>
    public static ApiResponse<T> Forbidden(string message = "Acesso negado", List<string>? errors = null)
        => new(false, message, default, errors, 403);

    /// <summary>
    /// Cria uma resposta de não encontrado (404 Not Found)
    /// </summary>
    public static ApiResponse<T> NotFound(string message, List<string>? errors = null)
        => new(false, message, default, errors, 404);

    /// <summary>
    /// Cria uma resposta de conflito (409 Conflict)
    /// </summary>
    public static ApiResponse<T> Conflict(string message, List<string>? errors = null)
        => new(false, message, default, errors, 409);

    /// <summary>
    /// Cria uma resposta de erro interno (500 Internal Server Error)
    /// </summary>
    public static ApiResponse<T> InternalServerError(string message = "Erro interno no servidor", List<string>? errors = null)
        => new(false, message, default, errors, 500);
}

/// <summary>
/// Representa uma resposta padronizada da API sem dados tipados
/// </summary>
public class ApiResponse : ApiResponse<object>
{
    protected ApiResponse() { }

    protected ApiResponse(bool success, string message, object? data = null, List<string>? errors = null, int statusCode = 200)
        : base(success, message, data, errors, statusCode) { }

    /// <summary>
    /// Cria uma resposta de sucesso simples (200 OK)
    /// </summary>
    public static ApiResponse OkMessage(string message = "Operação realizada com sucesso")
        => new(true, message, null, null, 200);

    /// <summary>
    /// Cria uma resposta de sucesso com dados (200 OK)
    /// </summary>
    public new static ApiResponse Ok(object data, string message = "Operação realizada com sucesso")
        => new(true, message, data, null, 200);

    /// <summary>
    /// Cria uma resposta de sucesso para criação (201 Created)
    /// </summary>
    public new static ApiResponse Created(object data, string message = "Recurso criado com sucesso")
        => new(true, message, data, null, 201);

    /// <summary>
    /// Cria uma resposta de sucesso sem conteúdo (204 No Content)
    /// </summary>
    public static ApiResponse NoContentMessage(string message = "Operação realizada com sucesso")
        => new(true, message, null, null, 204);

    /// <summary>
    /// Cria uma resposta de erro de validação (400 Bad Request)
    /// </summary>
    public new static ApiResponse BadRequest(string message, List<string>? errors = null)
        => new(false, message, null, errors, 400);

    /// <summary>
    /// Cria uma resposta de erro de validação com erro único
    /// </summary>
    public new static ApiResponse BadRequest(string message, string error)
        => new(false, message, null, new List<string> { error }, 400);

    /// <summary>
    /// Cria uma resposta de não autorizado (401 Unauthorized)
    /// </summary>
    public new static ApiResponse Unauthorized(string message = "Não autorizado", List<string>? errors = null)
        => new(false, message, null, errors, 401);

    /// <summary>
    /// Cria uma resposta de acesso negado (403 Forbidden)
    /// </summary>
    public new static ApiResponse Forbidden(string message = "Acesso negado", List<string>? errors = null)
        => new(false, message, null, errors, 403);

    /// <summary>
    /// Cria uma resposta de não encontrado (404 Not Found)
    /// </summary>
    public new static ApiResponse NotFound(string message, List<string>? errors = null)
        => new(false, message, null, errors, 404);

    /// <summary>
    /// Cria uma resposta de conflito (409 Conflict)
    /// </summary>
    public new static ApiResponse Conflict(string message, List<string>? errors = null)
        => new(false, message, null, errors, 409);

    /// <summary>
    /// Cria uma resposta de erro interno (500 Internal Server Error)
    /// </summary>
    public new static ApiResponse InternalServerError(string message = "Erro interno no servidor", List<string>? errors = null)
        => new(false, message, null, errors, 500);
}

// Mantendo compatibilidade com código existente
public class Result<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static Result<T> SuccessResult(T data, string message = "Operação realizada com sucesso")
        => new() { Success = true, Message = message, Data = data };

    public static Result<T> FailureResult(string message, string[]? errors = null)
        => new() { Success = false, Message = message, Errors = errors?.ToList() };

    public static Result<T> FailureResult(string message, string error)
        => new() { Success = false, Message = message, Errors = new List<string> { error } };
}

public class Result
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static Result SuccessResult(string message = "Operação realizada com sucesso")
        => new() { Success = true, Message = message };

    public static Result SuccessResult(object data, string message = "Operação realizada com sucesso")
        => new() { Success = true, Message = message, Data = data };

    public static Result FailureResult(string message, string[]? errors = null)
        => new() { Success = false, Message = message, Errors = errors?.ToList() };

    public static Result FailureResult(string message, string error)
        => new() { Success = false, Message = message, Errors = new List<string> { error } };
}