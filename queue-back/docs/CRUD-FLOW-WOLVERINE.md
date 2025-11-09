# Fluxo CRUD Universal com Wolverine - Clean Architecture

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Fluxo Completo de um CRUD](#fluxo-completo-de-um-crud)
4. [Implementação Detalhada por Camada](#implementação-detalhada-por-camada)
5. [Exemplo Prático Completo](#exemplo-prático-completo)
6. [Boas Práticas e Princípios Clean Code](#boas-práticas-e-princípios-clean-code)

---

## 🎯 Visão Geral

Este documento descreve o fluxo completo de operações CRUD (Create, Read, Update, Delete) utilizando **Wolverine** como mediator/message bus, seguindo os princípios de **Clean Architecture** e **Clean Code**.

### O que é Wolverine?

Wolverine é um framework de mensageria e mediação para .NET que substitui o MediatR, oferecendo:
- **Message Handlers** automáticos via convenção
- **Processamento assíncrono** de comandos e queries
- **Melhor performance** que MediatR
- **Menos código boilerplate**
- **Suporte nativo a transações**

---

## 📁 Estrutura de Pastas

### Organização Completa do Projeto

```
cronly-back/
├── src/
│   ├── API/                          # Camada de Apresentação
│   │   ├── Controllers/              # [OPCIONAL] Controllers tradicionais
│   │   ├── Endpoints/                # ✅ Minimal APIs / Endpoints (RECOMENDADO)
│   │   ├── Extensions/               # Extension methods para configuração
│   │   ├── Filters/                  # Filtros de validação e exceção
│   │   └── Middlewares/              # Middlewares customizados
│   │
│   ├── Application/                  # Camada de Aplicação (Casos de Uso)
│   │   ├── Commands/                 # ✅ Comandos (Create, Update, Delete)
│   │   ├── Queries/                  # ✅ Consultas (Read, List)
│   │   ├── Handlers/                 # ✅ Manipuladores de Commands/Queries
│   │   ├── DTOs/                     # ✅ Data Transfer Objects
│   │   ├── Mappings/                 # Mapeamentos (AutoMapper profiles)
│   │   ├── Validators/               # ✅ Validadores (FluentValidation)
│   │   └── Services/                 # Serviços de aplicação (orquestração)
│   │
│   ├── Domain/                       # Camada de Domínio (Regras de Negócio)
│   │   ├── Entities/                 # ✅ Entidades do domínio
│   │   ├── ValueObjects/             # ✅ Objetos de valor
│   │   ├── Interfaces/               # ✅ Interfaces de repositórios
│   │   ├── Events/                   # ✅ Eventos de domínio
│   │   ├── Enums/                    # Enumerações
│   │   └── Exceptions/               # ✅ Exceções de domínio
│   │
│   ├── Infrastructure/               # Camada de Infraestrutura
│   │   ├── Data/                     # Persistência de dados
│   │   │   ├── Contexts/             # ✅ DbContext do EF Core
│   │   │   ├── Configurations/       # ✅ Configurações de entidades
│   │   │   └── Migrations/           # Migrações do banco
│   │   ├── Repositories/             # ✅ Implementações de repositórios
│   │   ├── Services/                 # Serviços de infraestrutura externos
│   │   ├── Caching/                  # Implementações de cache
│   │   ├── Messaging/                # Implementações de mensageria
│   │   └── Logging/                  # Configurações de logging
│   │
│   └── CrossCutting/                 # Recursos transversais
│       ├── IoC/                      # ✅ Injeção de dependências
│       ├── Constants/                # Constantes globais
│       └── Helpers/                  # Utilitários
│
├── tests/
│   ├── Unit/                         # Testes unitários
│   │   ├── Application/              # Testes de handlers
│   │   └── Domain/                   # Testes de entidades
│   └── Integration/                  # Testes de integração
│       ├── API/                      # Testes de endpoints
│       └── Infrastructure/           # Testes de repositórios
│
└── docs/                             # Documentação
```

### ✅ Pastas Utilizadas no CRUD (Ordem de Criação)

1. **Domain/Entities** - Criar entidade de domínio
2. **Domain/Interfaces** - Definir interface do repositório
3. **Domain/Exceptions** - Criar exceções específicas
4. **Application/DTOs** - Criar DTOs de request/response
5. **Application/Commands** - Criar comandos (Create, Update, Delete)
6. **Application/Queries** - Criar queries (GetById, GetAll)
7. **Application/Handlers** - Criar handlers para processar commands/queries
8. **Application/Validators** - Criar validadores FluentValidation
9. **Infrastructure/Data/Configurations** - Configurar mapeamento EF Core
10. **Infrastructure/Repositories** - Implementar repositório
11. **API/Endpoints** - Criar endpoints HTTP

---

## 🔄 Fluxo Completo de um CRUD

### Diagrama de Sequência

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌────────────┐      ┌────────────┐      ┌──────────┐
│ Cliente │      │ Endpoint │      │Validator│      │  Handler   │      │ Repository │      │ Database │
└────┬────┘      └────┬─────┘      └────┬────┘      └─────┬──────┘      └─────┬──────┘      └────┬─────┘
     │                │                  │                 │                    │                  │
     │  HTTP Request  │                  │                 │                    │                  │
     │───────────────>│                  │                 │                    │                  │
     │                │                  │                 │                    │                  │
     │                │ Cria Command/Query                 │                    │                  │
     │                │──────────────────┘                 │                    │                  │
     │                │                  │                 │                    │                  │
     │                │  Valida Request  │                 │                    │                  │
     │                │─────────────────>│                 │                    │                  │
     │                │                  │                 │                    │                  │
     │                │  ValidationResult│                 │                    │                  │
     │                │<─────────────────│                 │                    │                  │
     │                │                  │                 │                    │                  │
     │                │  Publish via Wolverine             │                    │                  │
     │                │────────────────────────────────────>│                    │                  │
     │                │                  │                 │                    │                  │
     │                │                  │                 │  Executa Lógica   │                  │
     │                │                  │                 │───────────────────>│                  │
     │                │                  │                 │                    │                  │
     │                │                  │                 │                    │  Query/Command   │
     │                │                  │                 │                    │─────────────────>│
     │                │                  │                 │                    │                  │
     │                │                  │                 │                    │  Result          │
     │                │                  │                 │                    │<─────────────────│
     │                │                  │                 │                    │                  │
     │                │                  │                 │  Entity/Data       │                  │
     │                │                  │                 │<───────────────────│                  │
     │                │                  │                 │                    │                  │
     │                │  Response DTO    │                 │                    │                  │
     │                │<────────────────────────────────────│                    │                  │
     │                │                  │                 │                    │                  │
     │  HTTP Response │                  │                 │                    │                  │
     │<───────────────│                  │                 │                    │                  │
     │                │                  │                 │                    │                  │
```

### Ordem de Execução (Passo a Passo)

#### 1️⃣ **CREATE (Criar novo registro)**

```
Cliente → Endpoint → Validator → Wolverine → Handler → Repository → Database
                                     ↓
                                  Events (opcional)
```

**Sequência:**
1. Cliente envia HTTP POST com dados
2. Endpoint recebe e cria `CreateCommand`
3. Validator valida o command
4. Wolverine publica o command
5. Handler processa o command
6. Handler chama Repository.Add()
7. Repository persiste no banco
8. Handler retorna DTO de resposta
9. Endpoint retorna HTTP 201 Created

#### 2️⃣ **READ (Consultar registros)**

##### READ BY ID (Buscar por ID)
```
Cliente → Endpoint → Wolverine → Handler → Repository → Database
```

**Sequência:**
1. Cliente envia HTTP GET /{id}
2. Endpoint cria `GetByIdQuery`
3. Wolverine publica a query
4. Handler processa a query
5. Handler chama Repository.GetByIdAsync()
6. Repository busca no banco
7. Handler mapeia para DTO
8. Endpoint retorna HTTP 200 OK

##### READ ALL (Listar todos)
```
Cliente → Endpoint → Wolverine → Handler → Repository → Database
```

**Sequência:**
1. Cliente envia HTTP GET com filtros/paginação
2. Endpoint cria `GetAllQuery`
3. Wolverine publica a query
4. Handler processa a query
5. Handler chama Repository.GetAllAsync()
6. Repository busca no banco (com filtros)
7. Handler mapeia para lista de DTOs
8. Endpoint retorna HTTP 200 OK

#### 3️⃣ **UPDATE (Atualizar registro)**

```
Cliente → Endpoint → Validator → Wolverine → Handler → Repository → Database
                                     ↓
                                  Events (opcional)
```

**Sequência:**
1. Cliente envia HTTP PUT /{id} com dados
2. Endpoint recebe e cria `UpdateCommand`
3. Validator valida o command
4. Wolverine publica o command
5. Handler verifica se registro existe
6. Handler atualiza propriedades da entidade
7. Handler chama Repository.Update()
8. Repository persiste mudanças
9. Handler retorna DTO atualizado
10. Endpoint retorna HTTP 200 OK

#### 4️⃣ **DELETE (Remover registro)**

```
Cliente → Endpoint → Wolverine → Handler → Repository → Database
                                   ↓
                                Events (opcional)
```

**Sequência:**
1. Cliente envia HTTP DELETE /{id}
2. Endpoint cria `DeleteCommand`
3. Wolverine publica o command
4. Handler verifica se registro existe
5. Handler chama Repository.Delete()
6. Repository remove do banco
7. Handler confirma exclusão
8. Endpoint retorna HTTP 204 No Content

---

## 💻 Implementação Detalhada por Camada

### Camada 1: Domain (Domínio)

#### 1.1 Entity (Entidade)

**Localização:** `src/Domain/Entities/`

**Responsabilidade:**
- Representar conceitos do negócio
- Conter regras de negócio
- Garantir consistência dos dados
- Não depender de frameworks externos

**Exemplo:** `Product.cs`

```csharp
namespace CronlyBack.Domain.Entities;

/// <summary>
/// Entidade de domínio representando um produto.
/// Contém todas as regras de negócio relacionadas a produtos.
/// </summary>
public class Product
{
    // Construtor privado para EF Core
    private Product() { }

    // Construtor para criação válida
    public Product(string name, string description, decimal price, int stockQuantity)
    {
        ValidateName(name);
        ValidatePrice(price);
        ValidateStockQuantity(stockQuantity);

        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Métodos de negócio
    public void UpdateDetails(string name, string description, decimal price)
    {
        ValidateName(name);
        ValidatePrice(price);

        Name = name;
        Description = description;
        Price = price;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateStock(int quantity)
    {
        ValidateStockQuantity(quantity);
        StockQuantity = quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    // Validações privadas
    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("O nome do produto não pode ser vazio.");

        if (name.Length < 3)
            throw new DomainException("O nome do produto deve ter no mínimo 3 caracteres.");

        if (name.Length > 100)
            throw new DomainException("O nome do produto deve ter no máximo 100 caracteres.");
    }

    private static void ValidatePrice(decimal price)
    {
        if (price < 0)
            throw new DomainException("O preço do produto não pode ser negativo.");
    }

    private static void ValidateStockQuantity(int quantity)
    {
        if (quantity < 0)
            throw new DomainException("A quantidade em estoque não pode ser negativa.");
    }
}
```

#### 1.2 Repository Interface (Interface do Repositório)

**Localização:** `src/Domain/Interfaces/`

**Responsabilidade:**
- Definir contrato de persistência
- Não conter implementação
- Independente de tecnologia

**Exemplo:** `IProductRepository.cs`

```csharp
namespace CronlyBack.Domain.Interfaces;

/// <summary>
/// Contrato para operações de persistência de produtos.
/// Segue o padrão Repository para abstrair o acesso a dados.
/// </summary>
public interface IProductRepository
{
    /// <summary>
    /// Busca um produto pelo seu identificador único.
    /// </summary>
    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retorna todos os produtos com paginação e filtros.
    /// </summary>
    Task<IEnumerable<Product>> GetAllAsync(
        int page = 1,
        int pageSize = 10,
        bool? isActive = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retorna a contagem total de produtos.
    /// </summary>
    Task<int> CountAsync(bool? isActive = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adiciona um novo produto.
    /// </summary>
    Task AddAsync(Product product, CancellationToken cancellationToken = default);

    /// <summary>
    /// Atualiza um produto existente.
    /// </summary>
    void Update(Product product);

    /// <summary>
    /// Remove um produto.
    /// </summary>
    void Delete(Product product);

    /// <summary>
    /// Persiste todas as mudanças no banco de dados.
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
```

#### 1.3 Domain Exception (Exceção de Domínio)

**Localização:** `src/Domain/Exceptions/`

**Responsabilidade:**
- Representar erros de regra de negócio
- Facilitar tratamento de exceções

**Exemplo:** `DomainException.cs`

```csharp
namespace CronlyBack.Domain.Exceptions;

/// <summary>
/// Exceção base para violações de regras de domínio.
/// </summary>
public class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }

    public DomainException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}

/// <summary>
/// Exceção quando uma entidade não é encontrada.
/// </summary>
public class NotFoundException : DomainException
{
    public NotFoundException(string entityName, object key)
        : base($"{entityName} com identificador '{key}' não foi encontrado.")
    {
    }
}
```

---

### Camada 2: Application (Aplicação)

#### 2.1 DTOs (Data Transfer Objects)

**Localização:** `src/Application/DTOs/`

**Responsabilidade:**
- Transferir dados entre camadas
- Isolar camadas de mudanças
- Não conter lógica de negócio

**Exemplo:** `ProductDtos.cs`

```csharp
namespace CronlyBack.Application.DTOs;

/// <summary>
/// DTO para requisição de criação de produto.
/// </summary>
public record CreateProductRequest
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
}

/// <summary>
/// DTO para requisição de atualização de produto.
/// </summary>
public record UpdateProductRequest
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
}

/// <summary>
/// DTO para requisição de atualização de estoque.
/// </summary>
public record UpdateProductStockRequest
{
    public int StockQuantity { get; init; }
}

/// <summary>
/// DTO de resposta com dados do produto.
/// </summary>
public record ProductResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// DTO para lista paginada de produtos.
/// </summary>
public record ProductListResponse
{
    public IEnumerable<ProductResponse> Products { get; init; } = [];
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
```

#### 2.2 Commands (Comandos)

**Localização:** `src/Application/Commands/`

**Responsabilidade:**
- Representar intenções de mudança de estado
- Conter dados necessários para a operação
- Não conter lógica

**Exemplo:** `ProductCommands.cs`

```csharp
namespace CronlyBack.Application.Commands;

/// <summary>
/// Comando para criar um novo produto.
/// Será processado pelo CreateProductHandler.
/// </summary>
public record CreateProductCommand
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
}

/// <summary>
/// Comando para atualizar um produto existente.
/// </summary>
public record UpdateProductCommand
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
}

/// <summary>
/// Comando para atualizar estoque do produto.
/// </summary>
public record UpdateProductStockCommand
{
    public Guid Id { get; init; }
    public int StockQuantity { get; init; }
}

/// <summary>
/// Comando para excluir um produto.
/// </summary>
public record DeleteProductCommand(Guid Id);

/// <summary>
/// Comando para ativar/desativar um produto.
/// </summary>
public record ToggleProductStatusCommand(Guid Id);
```

#### 2.3 Queries (Consultas)

**Localização:** `src/Application/Queries/`

**Responsabilidade:**
- Representar intenções de leitura
- Conter parâmetros de filtro/paginação
- Não modificar estado

**Exemplo:** `ProductQueries.cs`

```csharp
namespace CronlyBack.Application.Queries;

/// <summary>
/// Query para buscar produto por ID.
/// Retorna ProductResponse ou null.
/// </summary>
public record GetProductByIdQuery(Guid Id);

/// <summary>
/// Query para listar produtos com filtros e paginação.
/// </summary>
public record GetAllProductsQuery
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public bool? IsActive { get; init; }
}
```

#### 2.4 Handlers (Manipuladores)

**Localização:** `src/Application/Handlers/`

**Responsabilidade:**
- Processar commands e queries
- Orquestrar operações
- Chamar repositórios
- Mapear entidades para DTOs

**Convenção Wolverine:**
- Método `Handle` é chamado automaticamente
- Suporta injeção de dependências nos parâmetros
- Suporta `CancellationToken` automático

**Exemplo:** `ProductHandlers.cs`

```csharp
namespace CronlyBack.Application.Handlers;

/// <summary>
/// Handler para criar novos produtos.
/// Wolverine detecta automaticamente este handler pela convenção de nome do método Handle.
/// </summary>
public class CreateProductHandler
{
    private readonly IProductRepository _repository;
    private readonly ILogger<CreateProductHandler> _logger;

    public CreateProductHandler(
        IProductRepository repository,
        ILogger<CreateProductHandler> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Processa o comando de criação de produto.
    /// </summary>
    public async Task<ProductResponse> Handle(
        CreateProductCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Criando produto: {ProductName}", command.Name);

        // Cria entidade de domínio (com validações)
        var product = new Product(
            command.Name,
            command.Description,
            command.Price,
            command.StockQuantity);

        // Persiste no banco
        await _repository.AddAsync(product, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Produto criado com sucesso: {ProductId}", product.Id);

        // Retorna DTO
        return MapToResponse(product);
    }

    private static ProductResponse MapToResponse(Product product)
    {
        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}

/// <summary>
/// Handler para buscar produto por ID.
/// </summary>
public class GetProductByIdHandler
{
    private readonly IProductRepository _repository;

    public GetProductByIdHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<ProductResponse?> Handle(
        GetProductByIdQuery query,
        CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(query.Id, cancellationToken);

        if (product is null)
            return null;

        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}

/// <summary>
/// Handler para listar todos os produtos.
/// </summary>
public class GetAllProductsHandler
{
    private readonly IProductRepository _repository;

    public GetAllProductsHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<ProductListResponse> Handle(
        GetAllProductsQuery query,
        CancellationToken cancellationToken)
    {
        var products = await _repository.GetAllAsync(
            query.Page,
            query.PageSize,
            query.IsActive,
            cancellationToken);

        var totalCount = await _repository.CountAsync(query.IsActive, cancellationToken);

        var productResponses = products.Select(p => new ProductResponse
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            StockQuantity = p.StockQuantity,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        });

        return new ProductListResponse
        {
            Products = productResponses,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}

/// <summary>
/// Handler para atualizar produto.
/// </summary>
public class UpdateProductHandler
{
    private readonly IProductRepository _repository;
    private readonly ILogger<UpdateProductHandler> _logger;

    public UpdateProductHandler(
        IProductRepository repository,
        ILogger<UpdateProductHandler> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<ProductResponse> Handle(
        UpdateProductCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Atualizando produto: {ProductId}", command.Id);

        // Busca produto existente
        var product = await _repository.GetByIdAsync(command.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), command.Id);

        // Atualiza usando método de domínio
        product.UpdateDetails(command.Name, command.Description, command.Price);

        // Persiste mudanças
        _repository.Update(product);
        await _repository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Produto atualizado com sucesso: {ProductId}", product.Id);

        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}

/// <summary>
/// Handler para excluir produto.
/// </summary>
public class DeleteProductHandler
{
    private readonly IProductRepository _repository;
    private readonly ILogger<DeleteProductHandler> _logger;

    public DeleteProductHandler(
        IProductRepository repository,
        ILogger<DeleteProductHandler> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Handle(
        DeleteProductCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Excluindo produto: {ProductId}", command.Id);

        var product = await _repository.GetByIdAsync(command.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), command.Id);

        _repository.Delete(product);
        await _repository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Produto excluído com sucesso: {ProductId}", command.Id);
    }
}
```

#### 2.5 Validators (Validadores)

**Localização:** `src/Application/Validators/`

**Responsabilidade:**
- Validar dados de entrada
- Retornar mensagens claras
- Executar antes dos handlers

**Exemplo:** `ProductValidators.cs`

```csharp
using FluentValidation;

namespace CronlyBack.Application.Validators;

/// <summary>
/// Validador para comando de criação de produto.
/// FluentValidation integra automaticamente com Wolverine.
/// </summary>
public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome do produto é obrigatório.")
            .MinimumLength(3)
            .WithMessage("O nome deve ter no mínimo 3 caracteres.")
            .MaximumLength(100)
            .WithMessage("O nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("A descrição deve ter no máximo 500 caracteres.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0)
            .WithMessage("O preço não pode ser negativo.");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0)
            .WithMessage("A quantidade em estoque não pode ser negativa.");
    }
}

/// <summary>
/// Validador para comando de atualização de produto.
/// </summary>
public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("O ID do produto é obrigatório.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome do produto é obrigatório.")
            .MinimumLength(3)
            .WithMessage("O nome deve ter no mínimo 3 caracteres.")
            .MaximumLength(100)
            .WithMessage("O nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0)
            .WithMessage("O preço não pode ser negativo.");
    }
}
```

---

### Camada 3: Infrastructure (Infraestrutura)

#### 3.1 DbContext Configuration

**Localização:** `src/Infrastructure/Data/Configurations/`

**Responsabilidade:**
- Mapear entidades para tabelas
- Configurar relacionamentos
- Definir constraints

**Exemplo:** `ProductConfiguration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CronlyBack.Infrastructure.Data.Configurations;

/// <summary>
/// Configuração do mapeamento da entidade Product para o banco de dados.
/// </summary>
public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .ValueGeneratedNever(); // Guid gerado pela aplicação

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.Property(p => p.Price)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(p => p.StockQuantity)
            .IsRequired();

        builder.Property(p => p.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .IsRequired();

        // Índices
        builder.HasIndex(p => p.Name);
        builder.HasIndex(p => p.IsActive);
    }
}
```

#### 3.2 DbContext

**Localização:** `src/Infrastructure/Data/Contexts/`

**Responsabilidade:**
- Gerenciar conexão com banco
- Aplicar configurações
- Rastrear mudanças

**Exemplo:** `ApplicationDbContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;

namespace CronlyBack.Infrastructure.Data.Contexts;

/// <summary>
/// Contexto principal do banco de dados da aplicação.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplica todas as configurações do assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
```

#### 3.3 Repository Implementation

**Localização:** `src/Infrastructure/Repositories/`

**Responsabilidade:**
- Implementar interface do domínio
- Executar queries no banco
- Não conter regras de negócio

**Exemplo:** `ProductRepository.cs`

```csharp
using Microsoft.EntityFrameworkCore;

namespace CronlyBack.Infrastructure.Repositories;

/// <summary>
/// Implementação do repositório de produtos usando Entity Framework Core.
/// </summary>
public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetAllAsync(
        int page = 1,
        int pageSize = 10,
        bool? isActive = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Products.AsNoTracking();

        if (isActive.HasValue)
            query = query.Where(p => p.IsActive == isActive.Value);

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(bool? isActive = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Products.AsQueryable();

        if (isActive.HasValue)
            query = query.Where(p => p.IsActive == isActive.Value);

        return await query.CountAsync(cancellationToken);
    }

    public async Task AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        await _context.Products.AddAsync(product, cancellationToken);
    }

    public void Update(Product product)
    {
        _context.Products.Update(product);
    }

    public void Delete(Product product)
    {
        _context.Products.Remove(product);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
```

---

### Camada 4: API (Apresentação)

#### 4.1 Endpoints (Minimal APIs)

**Localização:** `src/API/Endpoints/`

**Responsabilidade:**
- Definir rotas HTTP
- Receber requisições
- Enviar commands/queries via Wolverine
- Retornar respostas HTTP

**Exemplo:** `ProductEndpoints.cs`

```csharp
using Wolverine;

namespace CronlyBack.API.Endpoints;

/// <summary>
/// Endpoints HTTP para operações de produtos.
/// Usa Minimal APIs do ASP.NET Core.
/// </summary>
public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products")
            .WithTags("Products")
            .WithOpenApi();

        // CREATE
        group.MapPost("/", CreateProduct)
            .WithName("CreateProduct")
            .WithSummary("Criar novo produto")
            .Produces<ProductResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem();

        // READ BY ID
        group.MapGet("/{id:guid}", GetProductById)
            .WithName("GetProductById")
            .WithSummary("Buscar produto por ID")
            .Produces<ProductResponse>()
            .Produces(StatusCodes.Status404NotFound);

        // READ ALL
        group.MapGet("/", GetAllProducts)
            .WithName("GetAllProducts")
            .WithSummary("Listar todos os produtos")
            .Produces<ProductListResponse>();

        // UPDATE
        group.MapPut("/{id:guid}", UpdateProduct)
            .WithName("UpdateProduct")
            .WithSummary("Atualizar produto")
            .Produces<ProductResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .ProducesValidationProblem();

        // DELETE
        group.MapDelete("/{id:guid}", DeleteProduct)
            .WithName("DeleteProduct")
            .WithSummary("Excluir produto")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }

    /// <summary>
    /// Endpoint para criar um novo produto.
    /// </summary>
    private static async Task<IResult> CreateProduct(
        CreateProductRequest request,
        IMessageBus messageBus,
        CancellationToken cancellationToken)
    {
        var command = new CreateProductCommand
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity
        };

        // Wolverine processa o comando e retorna o resultado
        var response = await messageBus.InvokeAsync<ProductResponse>(command, cancellationToken);

        return Results.Created($"/api/products/{response.Id}", response);
    }

    /// <summary>
    /// Endpoint para buscar produto por ID.
    /// </summary>
    private static async Task<IResult> GetProductById(
        Guid id,
        IMessageBus messageBus,
        CancellationToken cancellationToken)
    {
        var query = new GetProductByIdQuery(id);

        var response = await messageBus.InvokeAsync<ProductResponse?>(query, cancellationToken);

        return response is not null
            ? Results.Ok(response)
            : Results.NotFound(new { Message = $"Produto com ID {id} não encontrado." });
    }

    /// <summary>
    /// Endpoint para listar produtos com paginação.
    /// </summary>
    private static async Task<IResult> GetAllProducts(
        IMessageBus messageBus,
        int page = 1,
        int pageSize = 10,
        bool? isActive = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAllProductsQuery
        {
            Page = page,
            PageSize = pageSize,
            IsActive = isActive
        };

        var response = await messageBus.InvokeAsync<ProductListResponse>(query, cancellationToken);

        return Results.Ok(response);
    }

    /// <summary>
    /// Endpoint para atualizar produto.
    /// </summary>
    private static async Task<IResult> UpdateProduct(
        Guid id,
        UpdateProductRequest request,
        IMessageBus messageBus,
        CancellationToken cancellationToken)
    {
        var command = new UpdateProductCommand
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price
        };

        try
        {
            var response = await messageBus.InvokeAsync<ProductResponse>(command, cancellationToken);
            return Results.Ok(response);
        }
        catch (NotFoundException ex)
        {
            return Results.NotFound(new { ex.Message });
        }
    }

    /// <summary>
    /// Endpoint para excluir produto.
    /// </summary>
    private static async Task<IResult> DeleteProduct(
        Guid id,
        IMessageBus messageBus,
        CancellationToken cancellationToken)
    {
        var command = new DeleteProductCommand(id);

        try
        {
            await messageBus.InvokeAsync(command, cancellationToken);
            return Results.NoContent();
        }
        catch (NotFoundException ex)
        {
            return Results.NotFound(new { ex.Message });
        }
    }
}
```

---

### Camada 5: CrossCutting (IoC)

#### 5.1 Dependency Injection

**Localização:** `src/CrossCutting/IoC/`

**Responsabilidade:**
- Registrar dependências
- Configurar Wolverine
- Configurar DbContext

**Exemplo:** `DependencyInjection.cs`

```csharp
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace CronlyBack.CrossCutting.IoC;

/// <summary>
/// Configuração central de injeção de dependências.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adiciona configurações de infraestrutura.
    /// </summary>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        // Repositórios
        services.AddScoped<IProductRepository, ProductRepository>();

        return services;
    }

    /// <summary>
    /// Adiciona configurações de aplicação.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<CreateProductCommandValidator>();

        return services;
    }

    /// <summary>
    /// Configura Wolverine para processamento de mensagens.
    /// </summary>
    public static IHostBuilder ConfigureWolverine(this IHostBuilder builder)
    {
        builder.UseWolverine(opts =>
        {
            // Descoberta automática de handlers
            opts.Discovery.IncludeAssembly(typeof(CreateProductHandler).Assembly);

            // Integração com FluentValidation
            opts.UseFluentValidation();

            // Configurações de política de retry
            opts.Policies.OnException<DbUpdateException>()
                .RetryWithCooldown(50.Milliseconds(), 100.Milliseconds(), 250.Milliseconds());
        });

        return builder;
    }
}
```

#### 5.2 Program.cs (Configuração Principal)

**Localização:** Raiz do projeto

**Responsabilidade:**
- Configurar pipeline
- Registrar middlewares
- Mapear endpoints

**Exemplo:** `Program.cs`

```csharp
using CronlyBack.API.Endpoints;
using CronlyBack.CrossCutting.IoC;

var builder = WebApplication.CreateBuilder(args);

// Adicionar serviços
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Adicionar camadas
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

// Configurar Wolverine
builder.Host.ConfigureWolverine();

var app = builder.Build();

// Configurar pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Mapear endpoints
app.MapProductEndpoints();

app.Run();
```

---

## 🎯 Exemplo Prático Completo

### Cenário: Sistema de Gerenciamento de Produtos

#### Requisição CREATE

```bash
POST /api/products
Content-Type: application/json

{
  "name": "Notebook Dell XPS 15",
  "description": "Notebook de alta performance",
  "price": 8999.99,
  "stockQuantity": 10
}
```

**Fluxo Interno:**

```
1. ProductEndpoints.CreateProduct()
   └─> Cria CreateProductCommand
   └─> messageBus.InvokeAsync<ProductResponse>(command)

2. Wolverine valida com CreateProductCommandValidator
   └─> Se inválido: retorna 400 Bad Request
   └─> Se válido: continua

3. Wolverine roteia para CreateProductHandler.Handle()
   └─> new Product(...) - cria entidade com validações de domínio
   └─> repository.AddAsync(product)
   └─> repository.SaveChangesAsync()
   └─> return ProductResponse

4. Endpoint retorna 201 Created com ProductResponse
```

#### Requisição READ

```bash
GET /api/products/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Fluxo Interno:**

```
1. ProductEndpoints.GetProductById()
   └─> Cria GetProductByIdQuery
   └─> messageBus.InvokeAsync<ProductResponse?>(query)

2. Wolverine roteia para GetProductByIdHandler.Handle()
   └─> repository.GetByIdAsync(id)
   └─> return ProductResponse ou null

3. Endpoint retorna:
   └─> 200 OK com ProductResponse (se encontrado)
   └─> 404 Not Found (se não encontrado)
```

#### Requisição UPDATE

```bash
PUT /api/products/3fa85f64-5717-4562-b3fc-2c963f66afa6
Content-Type: application/json

{
  "name": "Notebook Dell XPS 15 (Atualizado)",
  "description": "Notebook de altíssima performance",
  "price": 7999.99
}
```

**Fluxo Interno:**

```
1. ProductEndpoints.UpdateProduct()
   └─> Cria UpdateProductCommand
   └─> messageBus.InvokeAsync<ProductResponse>(command)

2. Wolverine valida com UpdateProductCommandValidator

3. Wolverine roteia para UpdateProductHandler.Handle()
   └─> repository.GetByIdAsync(id) - busca produto
   └─> product.UpdateDetails(...) - usa método de domínio
   └─> repository.Update(product)
   └─> repository.SaveChangesAsync()
   └─> return ProductResponse

4. Endpoint retorna 200 OK com ProductResponse
```

#### Requisição DELETE

```bash
DELETE /api/products/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Fluxo Interno:**

```
1. ProductEndpoints.DeleteProduct()
   └─> Cria DeleteProductCommand
   └─> messageBus.InvokeAsync(command)

2. Wolverine roteia para DeleteProductHandler.Handle()
   └─> repository.GetByIdAsync(id) - verifica existência
   └─> repository.Delete(product)
   └─> repository.SaveChangesAsync()

3. Endpoint retorna 204 No Content
```

---

## 🏆 Boas Práticas e Princípios Clean Code

### 1. **Single Responsibility Principle (SRP)**

Cada classe tem UMA única responsabilidade:

- **Entity**: Regras de negócio da entidade
- **Repository Interface**: Contrato de persistência
- **Repository Implementation**: Acesso a dados
- **Command/Query**: Representar intenção
- **Handler**: Processar comando/query
- **Validator**: Validar entrada
- **Endpoint**: Expor operação HTTP

### 2. **Dependency Inversion Principle (DIP)**

```
API → Application → Domain
  ↓         ↓
Infrastructure ←─┘

Domain não depende de ninguém
Application depende apenas de Domain
Infrastructure implementa interfaces de Domain
API depende de Application
```

### 3. **Separation of Concerns**

- **Camada Domain**: Apenas lógica de negócio pura
- **Camada Application**: Orquestração e casos de uso
- **Camada Infrastructure**: Detalhes técnicos
- **Camada API**: Interface HTTP

### 4. **Command Query Responsibility Segregation (CQRS)**

- **Commands**: Alteram estado (Create, Update, Delete)
- **Queries**: Apenas leem dados (GetById, GetAll)
- **Handlers separados** para cada responsabilidade

### 5. **Convenções de Nomenclatura**

```
Entity:           Product
Repository:       IProductRepository, ProductRepository
Command:          CreateProductCommand
Query:            GetProductByIdQuery
Handler:          CreateProductHandler
Validator:        CreateProductCommandValidator
DTO Request:      CreateProductRequest
DTO Response:     ProductResponse
Endpoint:         ProductEndpoints
Configuration:    ProductConfiguration
```

### 6. **Princípios SOLID no Código**

✅ **S - Single Responsibility**
- Cada handler processa UM comando/query

✅ **O - Open/Closed**
- Novas features = novos commands/handlers (sem alterar existentes)

✅ **L - Liskov Substitution**
- Repositórios podem ser substituídos por mocks em testes

✅ **I - Interface Segregation**
- Interfaces pequenas e específicas

✅ **D - Dependency Inversion**
- Domain define interfaces, Infrastructure implementa

### 7. **Clean Code Practices**

✅ **Nomes Descritivos**
```csharp
// ❌ Ruim
public async Task<P> H(C c) { }

// ✅ Bom
public async Task<ProductResponse> Handle(CreateProductCommand command) { }
```

✅ **Métodos Pequenos**
```csharp
// Cada handler faz uma coisa só
// Máximo 20-30 linhas
```

✅ **Sem Código Duplicado (DRY)**
```csharp
// Mapeamento centralizado
private static ProductResponse MapToResponse(Product product) { }
```

✅ **Validações no Lugar Certo**
```csharp
// Validação de entrada → Validator
// Validação de negócio → Entity
// Validação de existência → Handler
```

✅ **Async/Await Correto**
```csharp
// Sempre propagar CancellationToken
public async Task<T> Handle(Query query, CancellationToken ct) { }
```

✅ **Logging Significativo**
```csharp
_logger.LogInformation("Criando produto: {ProductName}", command.Name);
_logger.LogInformation("Produto criado: {ProductId}", product.Id);
```

### 8. **Tratamento de Erros**

```csharp
// Exceções de domínio
throw new DomainException("Regra de negócio violada");
throw new NotFoundException(nameof(Product), id);

// Captura no endpoint
try { ... }
catch (NotFoundException ex) {
    return Results.NotFound(new { ex.Message });
}
catch (DomainException ex) {
    return Results.BadRequest(new { ex.Message });
}
```

### 9. **Testes**

```
tests/
├── Unit/
│   ├── Application/
│   │   └── ProductHandlersTests.cs    # Testa handlers
│   └── Domain/
│       └── ProductTests.cs             # Testa entidades
└── Integration/
    ├── API/
    │   └── ProductEndpointsTests.cs    # Testa endpoints
    └── Infrastructure/
        └── ProductRepositoryTests.cs   # Testa repositório
```

---

## 📝 Checklist de Implementação

Ao criar um novo CRUD, siga esta ordem:

- [ ] 1. Criar entidade em `Domain/Entities`
- [ ] 2. Criar interface do repositório em `Domain/Interfaces`
- [ ] 3. Criar exceções em `Domain/Exceptions`
- [ ] 4. Criar DTOs em `Application/DTOs`
- [ ] 5. Criar Commands em `Application/Commands`
- [ ] 6. Criar Queries em `Application/Queries`
- [ ] 7. Criar Handlers em `Application/Handlers`
- [ ] 8. Criar Validators em `Application/Validators`
- [ ] 9. Criar Configuration em `Infrastructure/Data/Configurations`
- [ ] 10. Criar Repository em `Infrastructure/Repositories`
- [ ] 11. Registrar repositório em `CrossCutting/IoC`
- [ ] 12. Criar Endpoints em `API/Endpoints`
- [ ] 13. Mapear endpoints em `Program.cs`
- [ ] 14. Criar migration: `dotnet ef migrations add AddProduct`
- [ ] 15. Aplicar migration: `dotnet ef database update`
- [ ] 16. Testar todos os endpoints
- [ ] 17. Escrever testes unitários
- [ ] 18. Escrever testes de integração

---

## 🔗 Recursos Adicionais

- [Documentação Wolverine](https://wolverine.netlify.app/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [FluentValidation](https://docs.fluentvalidation.net/)

---

**Autor:** Documentação do Projeto Cronly  
**Data:** Outubro 2025  
**Versão:** 1.0
