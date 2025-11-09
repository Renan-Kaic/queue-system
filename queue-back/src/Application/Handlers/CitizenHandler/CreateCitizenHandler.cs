using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.CitizenHandler;

public class CreateCitizenHandler
{
    public async Task<ApiResponse<Citizen?>> Handle(
        CreateCitizenCommand command,
        ICitizenRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            if (!string.IsNullOrEmpty(command.Document)
                && await repository.GetByDocumentAsync(command.Document, cancellationToken) is not null)
            {
                return ApiResponse<Citizen?>.Conflict(
                    "Já existe um usuario cadastrado com o documento informado.",
                    [$"Já existe um usuario cadastrado com o documento '{command.Document}'."]
                );
            }

            if (!string.IsNullOrEmpty(command.Email)
                && await repository.GetByEmailAsync(command.Email, cancellationToken) is not null)
            {
                return ApiResponse<Citizen?>.Conflict(
                    "Já existe um usuario cadastrado com o email informado.",
                    [$"Já existe um usuario cadastrado com o email '{command.Email}'."]
                );
            }
            
            var citizen = new Citizen
            {
                Name = command.Name,
                Document = command.Document,
                Email = command.Email,
                Phone = command.Phone,
                Type = command.Type,
                CreatedAt = DateTime.UtcNow
            };

            
            var response = await repository.AddAsync(citizen, cancellationToken);
            if (response is null)
            {
                return ApiResponse<Citizen?>.InternalServerError(
                    "Erro ao criar o cliente",
                    ["Ocorreu um erro ao criar o cliente. Tente novamente mais tarde."]
                );
            }
            
            return ApiResponse<Citizen?>.Created(response, "Cliente criado com sucesso.");
        }
        catch (Exception e)
        {
            return ApiResponse<Citizen?>.InternalServerError(
                "Erro ao criar o cliente",
                ["Ocorreu um erro ao criar o cliente. Tente novamente mais tarde."]
            );
        }
    }
}