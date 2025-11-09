using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Domain.Entities;
using cronly_back.shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace cronly_back.API.Controllers;

[Route("ticket/")]
[Authorize]
public class TicketController (IMessageBus messageBus,
    ILogger<TicketController> logger) : BaseApiController
{
    [HttpPost("")]
    public async Task<IActionResult> Create([FromBody] CreateTicketRequest request)
    {
        try
        {
            var command = new CreateTicketCommand
            {
                QueueId = request.QueueId,
                CitizenId = request.CitizenId,
                Priority = request.Priority,
            };

            var response = await messageBus.InvokeAsync<ApiResponse<Ticket?>>(command);
            
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao criar ticket");
            return InternalServerErrorResponse(
                "Erro ao criar o ticket.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpGet("")]
    public async Task<IActionResult> GetAll()
    {
        var command = new GetAllTicketsCommand();
        var response = await messageBus.InvokeAsync<ApiResponse<IList<Ticket>>>(command);

        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var command = new GetTicketByIdCommand(id);
        var response = await messageBus.InvokeAsync<ApiResponse<Ticket?>>(command);

        return StatusCode(response.StatusCode, response);
    }

    [HttpPut("")]
    public async Task<IActionResult> Update([FromBody] UpdateTicketRequest request)
    {
        try
        {
            var command = new UpdateTicketCommand
            {
                Id = request.Id,
                TicketNumber = request.TicketNumber,
                TicketStatus = request.TicketStatus,
                Priority = request.Priority
            };

            var response = await messageBus.InvokeAsync<ApiResponse<Ticket?>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao atualizar ticket");
            return InternalServerErrorResponse(
                "Erro ao atualizar o ticket.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        try
        {
            var command = new DeleteTicketCommand(id);
            var response = await messageBus.InvokeAsync<ApiResponse<bool>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao excluir ticket");
            return InternalServerErrorResponse(
                "Erro ao excluir o ticket.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpPost("next-ticket")]
    public async Task<IActionResult> GetNextTicket([FromBody] GetNextTicketRequest request)
    {
        try
        {
            var command = new GetNextTicketCommand(request.QueueId);
            
            var response = await messageBus.InvokeAsync<ApiResponse<TicketResponseDto?>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao atualizar ticket");
            return InternalServerErrorResponse(
                "Erro ao atualizar o ticket.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpPost("recall-last-ticket")]
    public async Task<IActionResult> GetLastTicket([FromBody] RecallLastTicketRequest request)
    {
        try
        {
            var command = new GetLastTicketCommand(request.QueueId);
            var response = await messageBus.InvokeAsync<ApiResponse<TicketResponseDto?>>(command);
            
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}