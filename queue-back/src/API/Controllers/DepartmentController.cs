using cronly_back.Application.Commands;
using cronly_back.Application.DTOs;
using cronly_back.Domain.Entities;
using cronly_back.shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace cronly_back.API.Controllers;

[Route("department/")]
[Authorize]
public class DepartmentController (IMessageBus messageBus,
    ILogger<DepartmentController> logger) : BaseApiController
{
    [HttpPost("")]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentRequest request)
    {
        try
        {
            var command = new CreateDepartmentCommand
            {
                Name = request.Name,
                Description = request.Description,
                Code = request.Code,
                Capacity = request.Capacity,
                Status = request.Status
            };
            
            var response = await messageBus.InvokeAsync<ApiResponse<Department?>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao cadastrar departamento");
            return InternalServerErrorResponse(
                "Erro ao criar o departamento.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }
    
    [HttpPut("")]
    public async Task<IActionResult> Update([FromBody] UpdateDepartmentRequest request)
    {
        try
        {
            var command = new UpdateDepartmentCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                Code = request.Code,
                Capacity = request.Capacity,
                Status = request.Status
            };
            
            var response = await messageBus.InvokeAsync<ApiResponse<Department?>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao atualizar departamento");
            return InternalServerErrorResponse(
                "Erro ao atualizar o departamento.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        try
        {
            var command = new DeleteDepartmentCommand(id);
            var response = await messageBus.InvokeAsync<ApiResponse<bool>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao excluir departamento");
            return InternalServerErrorResponse(
                "Erro ao excluir o departamento.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }
    
    [HttpGet("")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var command = new GetAllDepartmentsCommand();
            var response = await messageBus.InvokeAsync<ApiResponse<IList<Department>>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao listar departamentos");
            return InternalServerErrorResponse(
                "Erro ao buscar os departamentos.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        try
        {
            var command = new GetDepartmentByIdCommand(id);
            var response = await messageBus.InvokeAsync<ApiResponse<Department?>>(command);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Erro ao buscar departamento por ID");
            return InternalServerErrorResponse(
                "Erro ao buscar o departamento.",
                ["Por favor, tente novamente mais tarde."]
            );
        }
    }
}