# Padrão de Respostas da API

## Visão Geral

Este documento descreve o padrão de respostas padronizado implementado na API do Cronly Backend. Todas as respostas da API seguem uma estrutura consistente para facilitar o consumo pelo frontend.

## Estrutura de Resposta

Todas as respostas da API seguem o seguinte formato JSON:

```json
{
  "success": true|false,
  "message": "Mensagem descritiva da operação",
  "data": { ... } | null,
  "errors": ["erro1", "erro2"] | null,
  "statusCode": 200,
  "timestamp": "2025-10-27T12:34:56.789Z"
}
```

### Campos

- **success** (boolean): Indica se a operação foi bem-sucedida
- **message** (string): Mensagem descritiva sobre o resultado da operação
- **data** (object|null): Dados retornados pela operação (null em caso de erro)
- **errors** (array|null): Lista de erros detalhados (null em caso de sucesso)
- **statusCode** (number): Código de status HTTP da resposta
- **timestamp** (string): Data e hora UTC da resposta no formato ISO 8601

## Classes Disponíveis

### ApiResponse<T>

Classe genérica para respostas com dados tipados.

```csharp
// Resposta de sucesso com dados (200 OK)
ApiResponse<UserResponse>.Ok(userData, "Usuário encontrado com sucesso")

// Resposta de criação (201 Created)
ApiResponse<SchoolResponse>.Created(schoolData, "Escola criada com sucesso")

// Resposta de erro de validação (400 Bad Request)
ApiResponse<UserResponse>.BadRequest("Dados inválidos", new List<string> { "Email já cadastrado" })

// Resposta de não autorizado (401 Unauthorized)
ApiResponse<UserResponse>.Unauthorized("Token inválido")

// Resposta de não encontrado (404 Not Found)
ApiResponse<UserResponse>.NotFound("Usuário não encontrado")

// Resposta de erro interno (500 Internal Server Error)
ApiResponse<UserResponse>.InternalServerError("Erro ao processar requisição")
```

### BaseApiController

Classe base para todos os controllers da API com métodos auxiliares para respostas padronizadas.

## Métodos Auxiliares

Todos os controllers devem herdar de `BaseApiController` e usar os seguintes métodos:

### Respostas de Sucesso

```csharp
// 200 OK - Com dados
return OkResponse(data, "Operação realizada com sucesso");

// 200 OK - Sem dados
return OkResponse("Operação realizada com sucesso");

// 201 Created - Recurso criado
return CreatedResponse(data, "Recurso criado com sucesso");

// 204 No Content - Operação sem retorno
return NoContentResponse("Operação realizada com sucesso");
```

### Respostas de Erro

```csharp
// 400 Bad Request - Erro de validação
return BadRequestResponse("Dados inválidos", new List<string> { "Campo obrigatório" });
return BadRequestResponse("Dados inválidos", "Campo obrigatório");

// 401 Unauthorized - Não autorizado
return UnauthorizedResponse("Token inválido");

// 403 Forbidden - Acesso negado
return ForbiddenResponse("Você não tem permissão para acessar este recurso");

// 404 Not Found - Recurso não encontrado
return NotFoundResponse("Recurso não encontrado");

// 409 Conflict - Conflito
return ConflictResponse("Recurso já existe");

// 500 Internal Server Error - Erro interno
return InternalServerErrorResponse("Erro interno no servidor");
```

## Exemplos de Uso

### Exemplo 1: Endpoint de Sucesso com Dados

```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetUser(string id)
{
    try
    {
        var user = await _userService.GetByIdAsync(id);
        
        if (user == null)
        {
            return NotFoundResponse(
                "Usuário não encontrado",
                new List<string> { $"Nenhum usuário encontrado com o ID '{id}'." }
            );
        }
        
        return OkResponse(user, "Usuário recuperado com sucesso");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Erro ao buscar usuário {UserId}", id);
        return InternalServerErrorResponse(
            "Erro ao buscar usuário",
            new List<string> { "Por favor, tente novamente mais tarde." }
        );
    }
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Usuário recuperado com sucesso",
  "data": {
    "id": "123",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "errors": null,
  "statusCode": 200,
  "timestamp": "2025-10-27T12:34:56.789Z"
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "message": "Usuário não encontrado",
  "data": null,
  "errors": ["Nenhum usuário encontrado com o ID '123'."],
  "statusCode": 404,
  "timestamp": "2025-10-27T12:34:56.789Z"
}
```

### Exemplo 2: Endpoint de Criação

```csharp
[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> CreateSchool([FromBody] CreateSchoolRequest request)
{
    try
    {
        var command = new CreateSchoolCommand { /* ... */ };
        var response = await _messageBus.InvokeAsync<SchoolResponse>(command);
        
        return CreatedResponse(response, "Escola criada com sucesso");
    }
    catch (ValidationException ex)
    {
        return BadRequestResponse(
            "Dados inválidos",
            ex.Errors.Select(e => e.ErrorMessage).ToList()
        );
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Erro ao criar escola");
        return InternalServerErrorResponse(
            "Erro ao criar escola",
            new List<string> { "Por favor, tente novamente mais tarde." }
        );
    }
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Escola criada com sucesso",
  "data": {
    "id": "456",
    "name": "Escola ABC",
    "token": "xyz-123"
  },
  "errors": null,
  "statusCode": 201,
  "timestamp": "2025-10-27T12:34:56.789Z"
}
```

### Exemplo 3: Endpoint com Validação

```csharp
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
                "Usuário não autenticado",
                new List<string> { "Token inválido ou expirado." }
            );
        }
        
        var command = new UpdateUserProfileCommand { /* ... */ };
        var response = await _messageBus.InvokeAsync<UserResponse>(command);
        
        return OkResponse(response, "Perfil atualizado com sucesso");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Erro ao atualizar perfil");
        return InternalServerErrorResponse(
            "Erro ao atualizar perfil",
            new List<string> { "Por favor, tente novamente mais tarde." }
        );
    }
}
```

## Códigos de Status HTTP

| Código | Significado | Quando Usar |
|--------|-------------|-------------|
| 200 | OK | Requisição bem-sucedida com dados |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Operação bem-sucedida sem dados de retorno |
| 400 | Bad Request | Erro de validação ou dados inválidos |
| 401 | Unauthorized | Usuário não autenticado |
| 403 | Forbidden | Usuário autenticado mas sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito com o estado atual (ex: duplicação) |
| 500 | Internal Server Error | Erro interno do servidor |

## Boas Práticas

1. **Sempre use os métodos auxiliares** do `BaseApiController` ao invés de criar respostas manualmente
2. **Mensagens claras**: Use mensagens descritivas que ajudem o frontend a entender o que aconteceu
3. **Erros detalhados**: Em caso de erro, forneça uma lista de erros específicos quando possível
4. **Logging**: Sempre faça log de erros antes de retornar uma resposta de erro
5. **Tratamento de exceções**: Sempre envolva a lógica em try-catch e retorne erros apropriados
6. **Validação**: Valide os dados de entrada e retorne `BadRequestResponse` com erros específicos
7. **Autenticação**: Verifique autenticação/autorização no início do método e retorne `UnauthorizedResponse` se necessário
8. **Status codes corretos**: Use o código de status HTTP apropriado para cada situação

## Compatibilidade com Código Existente

As classes `Result` e `Result<T>` foram mantidas para compatibilidade com código existente, mas novos endpoints devem usar `ApiResponse` e `ApiResponse<T>` através dos métodos auxiliares do `BaseApiController`.

## Migrando Código Existente

### Antes:
```csharp
return Ok(new { message = "Sucesso", data = result });
return BadRequest("Erro de validação");
return NotFound("Recurso não encontrado");
```

### Depois:
```csharp
return OkResponse(result, "Sucesso");
return BadRequestResponse("Erro de validação");
return NotFoundResponse("Recurso não encontrado");
```

## Consumo no Frontend

O frontend pode facilmente verificar o sucesso da operação e tratar erros:

```typescript
const response = await fetch('/api/users/123');
const result = await response.json();

if (result.success) {
  // Operação bem-sucedida
  console.log(result.message);
  console.log(result.data);
} else {
  // Erro na operação
  console.error(result.message);
  if (result.errors) {
    result.errors.forEach(error => console.error(error));
  }
}
```
