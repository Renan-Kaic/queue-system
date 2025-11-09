using cronly_back.Application.Commands;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Interfaces;
using cronly_back.shared;

namespace cronly_back.Application.Handlers.QueueHandler;

public class GetAllQueuesHandler
{
    public async Task<ApiResponse<IList<Queue>>> Handle(
        GetAllQueuesCommand command,
        IQueueRepository repository,
        CancellationToken cancellationToken)
    {
        try
        {
            var queues = await repository.GetAllAsync(cancellationToken);
            return ApiResponse<IList<Queue>>.Ok(queues, "Filas recuperadas com sucesso.");
        }
        catch (Exception)
        {
            return ApiResponse<IList<Queue>>.InternalServerError(
                "Erro ao buscar filas.",
                ["Ocorreu um erro ao buscar as filas. Tente novamente mais tarde."]
            );
        }
    }
}
