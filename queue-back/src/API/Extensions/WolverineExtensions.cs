using System.ComponentModel.DataAnnotations;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.ErrorHandling;
using Wolverine.FluentValidation;
using Wolverine.Postgresql;

namespace cronly_back.API.Extensions;

public static class WolverineExtensions
{
    public static IHostBuilder AddWolverineMessaging(
        this IHostBuilder host,
        string? connectionString)
    {
        host.UseWolverine(opts =>
        {
            opts.UseEntityFrameworkCoreTransactions();
            opts.Policies.AutoApplyTransactions();
            opts.UseFluentValidation();
            opts.Discovery.IncludeAssembly(typeof(Program).Assembly);
            opts.PersistMessagesWithPostgresql(connectionString!);
        });
        
        return host;
    }
}