# Multi-stage Dockerfile para C#/.NET API
# Estágio 1: Build da aplicação
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de projeto primeiro (para melhor cache)
COPY *.csproj ./

# Limpar cache do NuGet e restaurar dependências
RUN dotnet nuget locals all --clear && \
    dotnet restore --verbosity normal

# Copiar código fonte
COPY . .

# Build da aplicação (sem --no-restore para garantir que as dependências estejam disponíveis)
RUN dotnet build -c Release

# Publicar aplicação
RUN dotnet publish -c Release -o /app/publish

# Estágio 2: Development
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS development

# Instalar dependências de sistema necessárias para desenvolvimento
RUN apk add --no-cache \
    curl \
    git

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de projeto
COPY *.csproj ./

# Limpar cache e restaurar dependências
RUN dotnet nuget locals all --clear && \
    dotnet restore --verbosity normal

# Copiar código fonte
COPY . .

# Criar diretórios necessários
RUN mkdir -p uploads/{images,avatars,products,documents} && \
    mkdir -p logs

# Definir variáveis de ambiente
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:5000

# Expor porta
EXPOSE 5000

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["dotnet", "run", "--urls", "http://0.0.0.0:5000"]

# Estágio 3: Imagem de produção
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S dotnetuser && \
    adduser -S dotnetuser -u 1001 -G dotnetuser

# Instalar dependências mínimas de sistema
RUN apk add --no-cache \
    curl \
    icu-libs

# Definir diretório de trabalho
WORKDIR /app

# Criar diretórios necessários
RUN mkdir -p uploads/{images,avatars,products,documents} && \
    mkdir -p logs && \
    chown -R dotnetuser:dotnetuser /app

# Copiar aplicação buildada do estágio anterior
COPY --from=builder --chown=dotnetuser:dotnetuser /app/publish .

# Definir variáveis de ambiente
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_EnableDiagnostics=0

# Mudar para usuário não-root
USER dotnetuser

# Expor porta
EXPOSE 5000

# Comando para iniciar a aplicação (substitua YourAppName pelo nome real da sua DLL)
ENTRYPOINT ["dotnet", "userProject.dll"]