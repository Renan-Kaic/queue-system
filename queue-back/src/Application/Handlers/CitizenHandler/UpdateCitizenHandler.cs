using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.CitizenHandler;

public class UpdateCitizenHandler 
{
    public async Task<ApiResponse<Citizen?>> Handle(
        UpdateCitizenCommand command,
        ICitizenRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var citizen = await repository.GetByIdAsync(command.Id, cancellationToken);
            if (citizen is null)
            {
                return ApiResponse<Citizen?>.NotFound("Usuario não encontrado.", 
                    ["Não foi encontrado usuario com os dados informados."]
                    );
            }
            
            if (!string.IsNullOrEmpty(command.Document))
            {
                var citizenByDocument = await repository.GetByDocumentAsync(command.Document, cancellationToken);
                if (citizenByDocument is not null && citizenByDocument.Id != command.Id)
                {
                    return ApiResponse<Citizen?>.Conflict(
                        "Já existe um usuario cadastrado com o documento informado.",
                        [$"Já existe um usuario cadastrado com o documento '{command.Document}'."]
                    );      
                }
            }

            if (!string.IsNullOrEmpty(command.Email))
            {
                var citizenByEmail = await repository.GetByEmailAsync(command.Email, cancellationToken);
                if (citizenByEmail is not null && citizenByEmail.Id != command.Id)
                {
                    return ApiResponse<Citizen?>.Conflict(
                        "Já existe um usuario cadastrado com o email informado.",
                        [$"Já existe um usuario cadastrado com o email '{command.Email}'."]
                    );
                }
            }
            
            citizen.Update(command.Name, command.Document, 
                command.Email, command.Phone, command.Type);
            
            var response = await repository.UpdateAsync(citizen, cancellationToken);
            return ApiResponse<Citizen?>.Ok(response, "Cliente atualizado com sucesso.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}