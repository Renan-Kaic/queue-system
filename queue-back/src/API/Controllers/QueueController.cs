using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Domain.Entities;
using cronly_back.shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace cronly_back.API.Controllers;

[Route("queue/")]
[Authorize]
    public class QueueController (IMessageBus messageBus,
        ILogger<QueueController> logger) : BaseApiController
{
    [HttpPost("")]
    public async Task<IActionResult> Create([FromBody] CreateQueueRequest request)
    {
        try
        {
            var command = new CreateQueueCommand
            {
                Name = request.Name,
                Code = request.Code,
                DepartmentId = request.DepartmentId,
                Description = request.Description,
                MaxQueueSize = request.MaxQueueSize,
                Status = request.Status
            };
            var response = await messageBus.InvokeAsync<ApiResponse<Queue>>(command);
            
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao cadastrar fila");
            return InternalServerErrorResponse(
                "Erro ao criar a fila.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpPut("")]
    public async Task<IActionResult> Update([FromBody] UpdateQueueRequest request)
    {
        try
        {
            var command = new UpdateQueueCommand
            {
                Id = request.Id,
                Name = request.Name,
                Code = request.Code,
                DepartmentId = request.DepartmentId,
                Description = request.Description,
                MaxQueueSize = request.MaxQueueSize,
                Status = request.Status
            };
            
            var response = await messageBus.InvokeAsync<ApiResponse<Queue?>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao atualizar fila");
            return InternalServerErrorResponse(
                "Erro ao atualizar a fila.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        try
        {
            var command = new DeleteQueueCommand(id);
            var response = await messageBus.InvokeAsync<ApiResponse<bool>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao excluir fila");
            return InternalServerErrorResponse(
                "Erro ao excluir a fila.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }
    
    [HttpGet("")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var command = new GetAllQueuesCommand();
            var response = await messageBus.InvokeAsync<ApiResponse<IList<Queue>>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao listar filas");
            return InternalServerErrorResponse(
                "Erro ao buscar as filas.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        try
        {
            var command = new GetQueueByIdCommand(id);
            var response = await messageBus.InvokeAsync<ApiResponse<Queue?>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao buscar fila por ID");
            return InternalServerErrorResponse(
                "Erro ao buscar a fila.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }
}