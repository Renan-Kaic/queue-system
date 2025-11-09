using cronly_back.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace cronly_back.API.Hubs;

[Authorize]
public class TicketHub (UserManager<ApplicationUser> userManager) : Hub
{
    public async Task JoinUserGroup()
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
        {
            await Clients.Caller.SendAsync("Error", "Usuário não autenticado.");
            return;
        }

        try
        {
            var user = await userManager.GetUserAsync(Context.User);
            if (user == null)
            {
                await Clients.Caller.SendAsync("Error", "Usuário não encontrado.");
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{user.Id}");
            await Clients.Caller.SendAsync("JoinedUserGroup", $"user_{user.Id}");
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Erro ao entrar no grupo: {ex.Message}");
        }
    }

    public async Task LeaveUserGroup()
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
        {
            await Clients.Caller.SendAsync("Error", "Usuário não autenticado.");
            return;
        }

        try
        {
            var user = await userManager.GetUserAsync(Context.User);
            if (user == null)
            {
                await Clients.Caller.SendAsync("Error", "Usuário não encontrado.");
                return;
            }

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{user.Id}");
            await Clients.Caller.SendAsync("LeftUserGroup", $"user_{user.Id}");
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Erro ao sair do grupo: {ex.Message}");
        }
    }

    public async Task JoinDepartmentGroup(string departmentId)
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
        {
            await Clients.Caller.SendAsync("Error", "Usuário não autenticado.");
            return;
        }

        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"department_{departmentId}");
            await Clients.Caller.SendAsync("JoinedDepartmentGroup", $"department_{departmentId}");
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Erro ao entrar no grupo do departamento: {ex.Message}");
        }
    }

    public async Task LeaveDepartmentGroup(string departmentId)
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
        {
            await Clients.Caller.SendAsync("Error", "Usuário não autenticado.");
            return;
        }

        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"department_{departmentId}");
            await Clients.Caller.SendAsync("LeftDepartmentGroup", $"department_{departmentId}");
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Erro ao sair do grupo do departamento: {ex.Message}");
        }
    }

    public override async Task OnConnectedAsync()
    {
        if (Context.User?.Identity?.IsAuthenticated == true)
        {
            var user = await userManager.GetUserAsync(Context.User);
            if (user != null)
            {
                await Clients.Caller.SendAsync("Connected", $"Conectado como {user.FullName}");
            }
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (exception != null)
        {
            // Log da exceção se necessário
        }
        await base.OnDisconnectedAsync(exception);
    }
}