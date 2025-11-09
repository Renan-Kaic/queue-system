using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cronly_back.Infrastructure.Data.Configurations;

public class ApplicationUserRoleConfig : IEntityTypeConfiguration<ApplicationUserRole>
{
    public void Configure(EntityTypeBuilder<ApplicationUserRole> builder)
    {
        builder.ToTable("AspNetUserRoles");

        builder.Property(x => x.PromotedBy)
            .IsRequired()
            .HasMaxLength(450);
        
        builder.Property(x => x.RemovedBy)
            .HasMaxLength(450);
        
        builder.Property(x => x.RoleStatus)
            .IsRequired()
            .HasDefaultValue(RoleStatus.Active)
            .HasConversion<string>();
        
        builder.Property(x => x.AssignedAt)
            .IsRequired()
            .HasColumnType("timestamptz")
            .HasDefaultValueSql("NOW()");
        
        builder.Property(x => x.RemovedAt)
            .HasColumnType("timestamptz");
        
        builder.HasOne(x => x.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
       
        builder.HasOne(x => x.PromotedByUser)
            .WithMany(u => u.RolesPromoted)
            .HasForeignKey(x => x.PromotedBy)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.RemovedByUser)
            .WithMany(u => u.RolesRemoved)
            .HasForeignKey(x => x.RemovedBy)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
        
        builder.HasIndex(x => x.RoleStatus)
            .HasDatabaseName("IX_AspNetUserRoles_RoleStatus");
        
        builder.HasIndex(x => x.AssignedAt)
            .HasDatabaseName("IX_AspNetUserRoles_AssignedAt");
        
        builder.HasIndex(x => new { x.UserId, x.RoleStatus })
            .HasDatabaseName("IX_AspNetUserRoles_UserId_RoleStatus");
        
        builder.HasIndex(x => x.PromotedBy)
            .HasDatabaseName("IX_AspNetUserRoles_PromotedBy");
        
        builder.HasIndex(x => x.RemovedBy)
            .HasDatabaseName("IX_AspNetUserRoles_RemovedBy");
    }
}