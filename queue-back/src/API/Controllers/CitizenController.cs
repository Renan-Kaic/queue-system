using System.Collections.Generic;
using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Domain.Entities;
using cronly_back.shared;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace cronly_back.API.Controllers;

[Route("citizen")]
[Authorize]
public class CitizenController(ILogger<CitizenController> logger,
    IMessageBus messageBus)
    : BaseApiController
{
    [HttpPost("")]
    public async Task<IActionResult> Create([FromBody] CreateCitizenRequest request)
    {
        try
        {
            var command = new CreateCitizenCommand
            {
                Name = request.Name,
                Document = request.Document,
                Email = request.Email,
                Phone = request.Phone,
                Type = request.Type
            };

            var response = await messageBus.InvokeAsync<ApiResponse<Citizen>>(command);

            return StatusCode(response.StatusCode, response);
        }
        catch (ValidationException e)
        {
            logger.LogError(e, "Erro ao criar cliente");
            return InternalServerErrorResponse(
                "Erro ao criar o cliente.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao criar cliente");
            return InternalServerErrorResponse(
                "Erro ao criar o cliente.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
        
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var command = new GetCitizenByIdCommand(id);
        var response = await messageBus.InvokeAsync<ApiResponse<Citizen?>>(command);

        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("")]
    public async Task<IActionResult> GetAll()
    {
        var command = new GetAllCitizensCommand();
        var response = await messageBus.InvokeAsync<ApiResponse<IList<Citizen>>>(command);

        return StatusCode(response.StatusCode, response);
    }

    [HttpPut("")]
    public async Task<IActionResult> Update([FromBody] UpdateCitizenRequest request)
    {
        try
        {
            var command = new UpdateCitizenCommand
            {
                Id = request.Id,
                Name = request.Name,
                Document = request.Document,
                Email = request.Email,
                Phone = request.Phone,
                Type = request.Type
            };
            var response = await messageBus.InvokeAsync<ApiResponse<Citizen>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao criar cliente");
            return InternalServerErrorResponse(
                "Erro ao criar o cliente.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        try
        {
            var command = new DeleteCitizenCommand(id);
            var response = await messageBus.InvokeAsync<ApiResponse<bool>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao excluir cliente");
            return InternalServerErrorResponse(
                "Erro ao excluir o cliente.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }
}