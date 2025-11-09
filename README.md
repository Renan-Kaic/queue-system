# 🎫 Sistema de Gerenciamento de Filas - Queue System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![.NET](https://img.shields.io/badge/.NET-9.0-purple.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Sistema completo de gerenciamento de filas em tempo real com notificações via SignalR, autenticação OAuth2 (Google), e interface responsiva desenvolvida com Next.js e DaisyUI.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Documentation](#-api-documentation)
- [SignalR Events](#-signalr-events)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Visão Geral

O **Queue System** é uma solução moderna e escalável para gerenciamento de filas de atendimento, ideal para bancos, hospitais, clínicas, órgãos públicos e qualquer estabelecimento que necessite organizar o fluxo de atendimento.

### Principais Recursos

- ✅ **Gerenciamento Completo de Filas**: Criação, edição e organização de múltiplas filas por departamento
- ✅ **Sistema de Tickets**: Emissão, chamada e acompanhamento em tempo real
- ✅ **Notificações em Tempo Real**: Utilizando SignalR/WebSockets para atualizações instantâneas
- ✅ **Autenticação Segura**: Integração com Google OAuth2 e JWT
- ✅ **Terminal de Atendimento**: Interface dedicada para visualização de senhas chamadas
- ✅ **Text-to-Speech**: Anúncio de senhas por voz (opcional)
- ✅ **Priorização de Atendimento**: Suporte a senhas prioritárias
- ✅ **Multi-Departamento**: Gerenciamento de filas por departamento
- ✅ **Histórico Completo**: Rastreamento de todas as ações e mudanças de status
- ✅ **Interface Responsiva**: Design moderno e adaptável a diferentes dispositivos

## 🚀 Tecnologias

### Backend (queue-back)

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **.NET Core** | 9.0 | Framework principal |
| **C#** | 12.0 | Linguagem de programação |
| **PostgreSQL** | 15+ | Banco de dados relacional |
| **Entity Framework Core** | 9.0 | ORM para acesso a dados |
| **Wolverine** | 5.0 | Messaging framework (CQRS) |
| **SignalR** | 1.2 | Comunicação em tempo real |
| **ASP.NET Identity** | 9.0 | Sistema de autenticação |
| **JWT Bearer** | 9.0 | Tokens de autenticação |
| **FluentValidation** | 12.0 | Validação de dados |
| **Swagger/OpenAPI** | 9.0 | Documentação da API |

### Frontend (queu-front)

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Next.js** | 16.0.1 | Framework React |
| **React** | 19.2.0 | Biblioteca UI |
| **TypeScript** | 5+ | Linguagem tipada |
| **Tailwind CSS** | 4.1 | Framework CSS |
| **DaisyUI** | 5.4 | Componentes UI |
| **SignalR Client** | 9.0.6 | Cliente WebSocket |
| **Axios** | 1.13 | Cliente HTTP |
| **Zustand** | 5.0 | Gerenciamento de estado |
| **Lucide React** | 0.553 | Ícones |
| **Sonner** | 2.0 | Notificações toast |

### Infraestrutura

- **Docker** & **Docker Compose** - Containerização
- **PostgreSQL 15-Alpine** - Banco de dados
- **pgAdmin 4** - Administração do banco
- **Nginx** - Proxy reverso (produção)

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────────────┐      ┌─────────────────────┐      │
│  │   Next.js Frontend  │◄────►│   ASP.NET API       │      │
│  │   (queu-front)      │      │   (Controllers)     │      │
│  └─────────────────────┘      └─────────────────────┘      │
│           │                              │                   │
│           │ SignalR                      │ REST              │
│           ▼                              ▼                   │
│  ┌─────────────────────────────────────────────────┐        │
│  │          SignalR Hub (Real-time)                │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  ┌──────────────────────┐    ┌─────────────────────┐       │
│  │   Command Handlers   │◄──►│   Query Handlers    │       │
│  │   (Wolverine CQRS)   │    │                     │       │
│  └──────────────────────┘    └─────────────────────┘       │
│              │                         │                     │
│              ▼                         ▼                     │
│  ┌─────────────────────────────────────────────────┐        │
│  │         Services & Validators                   │        │
│  │  (Business Logic, FluentValidation)             │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       DOMAIN LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Entities   │  │  Value Objs  │  │  Interfaces  │      │
│  │  (Models)    │  │              │  │  (Repos)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                       │
│  ┌─────────────────────────────────────────────────┐        │
│  │   Repository Implementations                    │        │
│  │   (Entity Framework Core + PostgreSQL)          │        │
│  └─────────────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────────────┐        │
│  │   External Services Integration                 │        │
│  │   (Google OAuth, Email, etc)                    │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Padrões Implementados

- **CQRS** (Command Query Responsibility Segregation) via Wolverine
- **Repository Pattern** para acesso a dados
- **Unit of Work** para transações
- **Dependency Injection** nativo do .NET
- **Domain-Driven Design (DDD)** princípios básicos
- **Clean Architecture** separação em camadas

## ✨ Funcionalidades

### 👥 Gerenciamento de Usuários

- Autenticação via Google OAuth2
- Sistema de roles (Admin, Coordenador, Atendente)
- Perfis de usuário com informações completas
- Controle de acesso baseado em permissões

### 🏢 Departamentos

- Criação e gerenciamento de departamentos
- Associação de usuários a departamentos
- Configuração independente por departamento

### 📋 Filas

- Múltiplas filas por departamento
- Configuração de prioridades
- Limites de capacidade
- Status de fila (ativa/inativa)
- Estatísticas em tempo real

### 🎟️ Tickets (Senhas)

- Emissão de senhas com código único
- Priorização automática (normal/prioritária)
- Estados: Aguardando → Chamada → Em atendimento → Concluída/Cancelada
- Histórico completo de mudanças de status
- Timestamps para cada mudança de estado

### 🖥️ Terminal de Atendimento

- Visualização em tempo real de senhas chamadas
- Chamada da próxima senha
- Rechamada da última senha
- Notificações visuais e sonoras
- Suporte a Text-to-Speech (TTS)
- Interface fullscreen otimizada

### 🔔 Notificações em Tempo Real

- SignalR para comunicação bidirecional
- Eventos de criação de tickets
- Eventos de chamada de tickets
- Atualizações de status de fila
- Notificações por departamento e usuário

### 📊 Dashboard e Relatórios

- Visão geral de todas as filas
- Estatísticas de atendimento
- Tempo médio de espera
- Tickets atendidos por período

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Backend

- [.NET SDK 9.0+](https://dotnet.microsoft.com/download)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/get-started) (opcional, para containerização)

### Frontend

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Ferramentas Recomendadas

- [Visual Studio 2022](https://visualstudio.microsoft.com/) ou [Rider](https://www.jetbrains.com/rider/)
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/)
- [pgAdmin 4](https://www.pgadmin.org/)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Renan-Kaic/queue-system.git
cd queue-system
```

### 2. Configuração do Backend

```bash
cd queue-back

# Restaurar pacotes NuGet
dotnet restore

# Aplicar migrations ao banco de dados
dotnet ef database update

# Ou usar o Docker Compose (recomendado)
docker-compose up -d postgres
```

### 3. Configuração do Frontend

```bash
cd queu-front

# Instalar dependências
npm install
# ou
yarn install
```

## ⚙️ Configuração

### Backend - appsettings.json

Crie/edite o arquivo `queue-back/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=queue_db;Username=postgres;Password=sua_senha;Timezone=America/Sao_Paulo"
  },
  "Jwt": {
    "Secret": "sua_chave_secreta_muito_segura_aqui",
    "Issuer": "QueueSystem",
    "Audience": "QueueSystem",
    "ExpiresInMinutes": 60
  },
  "GoogleAuth": {
    "ClientId": "seu-google-client-id.apps.googleusercontent.com",
    "ClientSecret": "seu-google-client-secret"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

### Frontend - .env.local

Crie o arquivo `queu-front/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Queue System
NEXT_PUBLIC_APP_VERSION=1.0.0

# Google OAuth (deve corresponder ao backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
```

### Docker Compose - .env

Crie o arquivo `.env` na raiz do projeto:

```env
# Database
DB_NAME=queue_db
DB_USER=postgres
DB_PASSWORD=postgres123
DB_PORT=5432
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_com_pelo_menos_32_caracteres
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=sua_chave_refresh_secreta
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15 minutes

# Logs
LOG_LEVEL=info

# pgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=8080
```

## 🚀 Executando o Projeto

### Opção 1: Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d

# Verificar logs
docker-compose logs -f api
```

Acesse:
- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **pgAdmin**: http://localhost:8080
- **Frontend**: Configure separadamente (ver abaixo)

### Opção 2: Executar Manualmente

#### Backend

```bash
cd queue-back

# Modo desenvolvimento
dotnet run

# Ou com hot-reload
dotnet watch run
```

A API estará disponível em `http://localhost:5000`

#### Frontend

```bash
cd queu-front

# Modo desenvolvimento
npm run dev
# ou
yarn dev

# Build para produção
npm run build
npm run start
```

O frontend estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

### Backend (queue-back)

```
queue-back/
├── src/
│   ├── API/                      # Controllers, Endpoints, Hubs
│   │   ├── Controllers/          # REST Controllers
│   │   ├── Endpoints/            # Minimal API endpoints
│   │   ├── Hubs/                 # SignalR Hubs
│   │   ├── Filters/              # Action Filters
│   │   ├── Middlewares/          # Custom Middlewares
│   │   └── Extensions/           # Service Extensions
│   ├── Application/              # Casos de uso, Handlers
│   │   ├── Commands/             # CQRS Commands
│   │   ├── Queries/              # CQRS Queries
│   │   ├── Handlers/             # Wolverine Handlers
│   │   ├── DTOs/                 # Data Transfer Objects
│   │   ├── Validators/           # FluentValidation
│   │   └── Services/             # Application Services
│   ├── Domain/                   # Entidades, Interfaces
│   │   ├── Entities/             # Domain Models
│   │   ├── Enums/                # Enumerations
│   │   ├── Events/               # Domain Events
│   │   ├── Exceptions/           # Domain Exceptions
│   │   ├── Interfaces/           # Repository Interfaces
│   │   └── ValueObjects/         # Value Objects
│   ├── Infrastructure/           # Implementações
│   │   ├── Data/                 # DbContext, Repositories
│   │   │   ├── Contexts/         # EF DbContext
│   │   │   ├── Repositories/     # Repository Implementations
│   │   │   └── Configurations/   # Entity Configurations
│   │   └── Services/             # External Services
│   ├── CrossCutting/             # Recursos compartilhados
│   │   ├── Extensions/           # Extension Methods
│   │   └── Helpers/              # Helper Classes
│   └── shared/                   # Compartilhado entre camadas
│       └── ApiResponse.cs        # Response Pattern
├── Migrations/                   # EF Core Migrations
├── docs/                         # Documentação
│   ├── API-RESPONSE-PATTERN.md
│   ├── CRUD-FLOW-WOLVERINE.md
│   ├── data_model_extended.md
│   └── checklist-backend.md
├── tests/                        # Testes
│   ├── Unit/                     # Testes unitários
│   └── Integration/              # Testes de integração
├── Program.cs                    # Entry point
├── appsettings.json              # Configurações
└── docker-compose.yml            # Docker setup
```

### Frontend (queu-front)

```
queu-front/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── app/                  # Rotas da aplicação
│   │   ├── terminal/             # Terminal de atendimento
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Home/Login
│   │   └── globals.css           # Estilos globais
│   ├── components/               # Componentes React
│   │   ├── Departamentos/        # Gerenciamento de departamentos
│   │   ├── filas/                # Gerenciamento de filas
│   │   ├── tickets/              # Gerenciamento de tickets
│   │   ├── terminal/             # Componentes do terminal
│   │   ├── usuarios/             # Gerenciamento de usuários
│   │   ├── Header/               # Cabeçalho da aplicação
│   │   ├── home/                 # Dashboard home
│   │   ├── ui/                   # Componentes UI reutilizáveis
│   │   └── providers/            # Context Providers
│   ├── services/                 # Serviços API
│   │   ├── signalRService.ts     # Cliente SignalR
│   │   ├── ticketService.ts      # API de tickets
│   │   ├── queueService.ts       # API de filas
│   │   └── departmentService.ts  # API de departamentos
│   ├── store/                    # Zustand stores
│   │   └── useStore.ts           # Global state
│   ├── hooks/                    # Custom hooks
│   │   └── useStore.ts           # Store hooks
│   ├── types/                    # TypeScript types
│   │   └── index.ts              # Type definitions
│   ├── lib/                      # Utilities
│   │   └── axios.ts              # Axios configuration
│   ├── handlers/                 # Handlers
│   │   └── resultHandler.tsx     # Result handling
│   └── examples/                 # Exemplos
│       └── queueExamples.ts      # Dados de exemplo
├── public/                       # Assets estáticos
├── next.config.ts                # Configuração Next.js
├── tailwind.config.js            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
└── package.json                  # Dependências
```

## 📚 API Documentation

### Endpoints Principais

#### Authentication

```http
POST /api/auth/google
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

#### Departments

```http
GET    /api/department           # Listar todos
GET    /api/department/{id}      # Buscar por ID
POST   /api/department           # Criar
PUT    /api/department           # Atualizar
DELETE /api/department/{id}      # Excluir
```

#### Queues

```http
GET    /api/queue                # Listar todas
GET    /api/queue/{id}           # Buscar por ID
POST   /api/queue                # Criar
PUT    /api/queue                # Atualizar
DELETE /api/queue/{id}           # Excluir
GET    /api/queue/department/{departmentId}  # Filas por departamento
```

#### Tickets

```http
GET    /api/ticket               # Listar todos
GET    /api/ticket/{id}          # Buscar por ID
POST   /api/ticket               # Criar ticket
PUT    /api/ticket               # Atualizar
DELETE /api/ticket/{id}          # Excluir
POST   /api/ticket/next-ticket   # Chamar próximo
POST   /api/ticket/recall-last-ticket  # Rechamar último
```

#### Users

```http
GET    /api/user                 # Listar todos
GET    /api/user/{id}            # Buscar por ID
POST   /api/user                 # Criar
PUT    /api/user                 # Atualizar
DELETE /api/user/{id}            # Excluir
```

### Padrão de Response

Todas as respostas seguem o padrão `ApiResponse`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operação realizada com sucesso",
  "data": { /* dados */ },
  "errors": [],
  "timestamp": "2025-11-09T12:00:00Z"
}
```

### Swagger UI

Acesse a documentação interativa em: `http://localhost:5000/swagger`

## 🔌 SignalR Events

### Hub: `/ticket-hub`

#### Client → Server

```typescript
// Entrar no grupo do usuário
connection.invoke('JoinUserGroup')

// Sair do grupo do usuário
connection.invoke('LeaveUserGroup')

// Entrar no grupo do departamento
connection.invoke('JoinDepartmentGroup', departmentId)

// Sair do grupo do departamento
connection.invoke('LeaveDepartmentGroup', departmentId)
```

#### Server → Client

```typescript
// Ticket chamado
connection.on('TicketCalled', (data: TicketCalledEvent) => {
  // data.ticketCode, data.queueName, data.departmentName, etc.
})

// Ticket criado
connection.on('TicketCreated', (data) => {
  // Novo ticket emitido
})

// Fila atualizada
connection.on('QueueUpdated', (data) => {
  // data.queueId, data.currentSize, data.maxSize
})

// Conectado
connection.on('Connected', (message) => {
  // Confirmação de conexão
})
```

### Exemplo de Uso

```typescript
import SignalRService from '@/services/signalRService'

const signalR = new SignalRService()

// Iniciar conexão
await signalR.startConnection()

// Escutar eventos
signalR.onTicketCalled((event) => {
  console.log(`Ticket ${event.ticketCode} chamado!`)
  // Atualizar UI
})

// Entrar em grupo
await signalR.connection?.invoke('JoinDepartmentGroup', '123')
```

## 🌐 Variáveis de Ambiente

### Backend (.env ou appsettings.json)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `CONNECTIONSTRING` | String de conexão PostgreSQL | - |
| `JWT_SECRET` | Chave secreta JWT | - |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | 1h |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth | - |
| `GOOGLE_CLIENT_SECRET` | Secret do Google OAuth | - |
| `LOG_LEVEL` | Nível de log | info |

### Frontend (.env.local)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | http://localhost:5000 |
| `NEXT_PUBLIC_APP_NAME` | Nome da aplicação | Queue System |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID Google | xxx.apps.googleusercontent.com |

## 📜 Scripts Disponíveis

### Backend

```bash
# Executar aplicação
dotnet run

# Executar com hot-reload
dotnet watch run

# Build
dotnet build

# Testes
dotnet test

# Criar migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Reverter migration
dotnet ef database update PreviousMigrationName

# Gerar script SQL
dotnet ef migrations script
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Iniciar produção
npm run start

# Lint
npm run lint

# Type check
npm run type-check
```

## 🧪 Testes

### Backend

```bash
cd queue-back

# Executar todos os testes
dotnet test

# Com cobertura
dotnet test /p:CollectCoverage=true /p:CoverageReportFormat=opencover

# Específicos
dotnet test --filter "FullyQualifiedName~TicketHandler"
```

### Frontend

```bash
cd queu-front

# Testes unitários (se configurados)
npm run test

# E2E tests (se configurados)
npm run test:e2e
```

## 🚢 Deploy

### Docker Production Build

```bash
# Build da imagem
docker build -t queue-system-api:latest -f Dockerfile .

# Executar
docker run -d -p 5000:5000 \
  -e CONNECTIONSTRING="..." \
  -e JWT_SECRET="..." \
  queue-system-api:latest
```

### Deploy Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd queu-front
vercel

# Produção
vercel --prod
```

### Nginx Configuration (Exemplo)

```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- **Backend**: Siga as convenções do C# e .NET
- **Frontend**: Use TypeScript, ESLint e Prettier
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)

### Code Review

Todas as contribuições passam por code review antes de serem mergeadas.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvedor Principal* - [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Comunidade .NET
- Next.js Team
- Todos os contribuidores

## 📞 Suporte

Para suporte, envie um email para suporte@seudominio.com ou abra uma issue no GitHub.

---

<div align="center">

**[⬆ Voltar ao topo](#-sistema-de-gerenciamento-de-filas---queue-system)**

Feito com ❤️ usando .NET 9.0 e Next.js 16

</div>
