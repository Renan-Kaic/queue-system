using cronly_back.Domain.Entities;
using cronly_back.Infrastructure.Data.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace cronly_back.Infrastructure.Data.Contexts;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext(options)
{
     public new DbSet<ApplicationUser> Users { get; set; }
     public new DbSet<ApplicationUserRole> Roles { get; set; }
     public DbSet<Citizen> Citizens { get; set; }
     public new DbSet<Department> Departments { get; set; }
     public new DbSet<Queue> Queues { get; set; }
     public new DbSet<Ticket> Tickets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new ApplicationUserConfig());
        builder.ApplyConfiguration(new ApplicationUserRoleConfig());
        builder.ApplyConfiguration(new CitizenConfig());
        builder.ApplyConfiguration(new DepartmentConfig());
        builder.ApplyConfiguration(new QueueConfig());
        builder.ApplyConfiguration(new TicketConfig());
        
        base.OnModelCreating(builder);
    }
}