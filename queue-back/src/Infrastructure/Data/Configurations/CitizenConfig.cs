using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cronly_back.Infrastructure.Data.Configurations;

public class CitizenConfig : IEntityTypeConfiguration<Citizen>
{
    public void Configure(EntityTypeBuilder<Citizen> builder)
    {
        builder.ToTable("Citizens");
        
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id")
            .UseIdentityColumn();
        
        builder.Property(x => x.Name)
            .HasColumnName("Name")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(x => x.Document)
            .HasColumnName("Document")
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired(false); 

        builder.Property(x => x.Email)
            .HasColumnName("Email")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired(false); 

        builder.Property(x => x.Phone)
            .HasColumnName("Phone")
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired(false); 

        builder.Property(x => x.Type)
            .HasColumnName("Type")
            .HasConversion<int>() 
            .HasDefaultValue(CitizenType.Normal)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("CreatedAt")
            .HasColumnType("timestamptz")
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("NOW()")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnType("timestamptz")
            .ValueGeneratedOnUpdate()
            .HasDefaultValueSql("NOW()")
            .IsRequired(false);

        builder.HasIndex(x => x.Document)
            .HasDatabaseName("IX_Citizens_Document")
            .HasFilter("\"Document\" IS NOT NULL"); 

        builder.HasIndex(x => x.Email)
            .HasDatabaseName("IX_Citizens_Email")
            .HasFilter("\"Email\" IS NOT NULL"); 

        builder.HasIndex(x => x.CreatedAt)
            .HasDatabaseName("IX_Citizens_CreatedAt");

        // Relacionamento: Um Citizen possui muitos Tickets
        builder.HasMany(c => c.Tickets)
            .WithOne(t => t.Citizen)
            .HasForeignKey(t => t.CitizenId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_Tickets_Citizens");
    }
}