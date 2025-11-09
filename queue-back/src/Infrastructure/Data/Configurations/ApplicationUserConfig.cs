using cronly_back.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cronly_back.Infrastructure.Data.Configurations;

public class ApplicationUserConfig : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.HasMany(u => u.UserRoles)
            .WithOne()
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Property(x => x.FullName)
            .HasMaxLength(255);
        builder.Property(x => x.GivenName)
            .HasMaxLength(255);
        builder.Property(x => x.Surname)
            .HasMaxLength(255);
        builder.Property(x => x.ProfilePictureUrl)
            .HasMaxLength(255);
    }
}