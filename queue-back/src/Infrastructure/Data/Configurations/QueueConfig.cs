using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cronly_back.Infrastructure.Data.Configurations;

public class QueueConfig : IEntityTypeConfiguration<Queue>
{
    public void Configure(EntityTypeBuilder<Queue> builder)
    {
        builder.ToTable("Queues");
        
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id")
            .UseIdentityColumn();
        
        builder.Property(x => x.Name)
            .HasColumnName("Name")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Property(x => x.Description)
            .HasColumnName("Description")
            .HasColumnType("varchar(500)")
            .HasMaxLength(500)
            .IsRequired(false);
        
        builder.Property(x => x.CurrentQueueSize)
            .HasColumnName("CurrentQueueSize")
            .HasDefaultValue(0)
            .IsRequired();
        
        builder.Property(x => x.Code)
            .HasColumnName("Code")
            .HasColumnType("varchar(50)")
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(x => x.MaxQueueSize)
            .HasColumnName("MaxQueueSize")
            .HasDefaultValue(1)
            .IsRequired();
        
        builder.Property(x => x.DepartmentId)
            .HasColumnName("DepartmentId")
            .IsRequired();
        
        builder.Property(x => x.Status)
            .HasColumnName("Status")
            .HasConversion<int>()
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
        
        // Relacionamento com Department
        builder.HasOne(x => x.Department)
            .WithMany()
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Índices
        builder.HasIndex(x => x.Code)
            .IsUnique()
            .HasDatabaseName("IX_Queue_Code");
        
        builder.HasIndex(x => x.DepartmentId)
            .HasDatabaseName("IX_Queue_DepartmentId");
        
        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Queue_Status");
    }
}