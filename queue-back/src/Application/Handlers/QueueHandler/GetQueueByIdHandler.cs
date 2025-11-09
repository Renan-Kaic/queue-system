using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.QueueHandler;

public class GetQueueByIdHandler
{
    public async Task<ApiResponse<Queue?>> Handle(
        GetQueueByIdCommand command,
        IQueueRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var queue = await repository.GetByIdAsync(command.Id, cancellationToken);
            if (queue is null)
            {
                return ApiResponse<Queue?>.NotFound(
                    "Fila não encontrada.",
                    [$"Nenhuma fila foi encontrada com o ID '{command.Id}'."]
                );
            }

            return ApiResponse<Queue?>.Ok(queue, "Fila encontrada com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<Queue?>.InternalServerError(
                "Erro ao buscar fila.",
                ["Ocorreu um erro ao buscar a fila. Tente novamente mais tarde."]
            );
        }
    }
}
