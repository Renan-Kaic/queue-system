using cronly_back.Application.Commands;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.QueueHandler;

public class DeleteQueueHandler
{
    public async Task<ApiResponse<bool>> Handle(
        DeleteQueueCommand command,
        IQueueRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var queue = await repository.GetByIdAsync(command.Id, cancellationToken);
            
            if (queue is null)
            {
                return ApiResponse<bool>.NotFound(
                    "Fila não encontrada.",
                    [$"Nenhuma fila foi encontrada com o ID '{command.Id}'."]
                );
            }

            var deleted = await repository.DeleteAsync(queue, cancellationToken);
            
            if (!deleted)
            {
                return ApiResponse<bool>.InternalServerError(
                    "Erro ao excluir fila.",
                    ["Ocorreu um erro ao excluir a fila. Tente novamente mais tarde."]
                );
            }

            return ApiResponse<bool>.Ok(true, "Fila excluída com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<bool>.InternalServerError(
                "Erro ao excluir fila.",
                ["Ocorreu um erro ao excluir a fila. Tente novamente mais tarde."]
            );
        }
    }
}
