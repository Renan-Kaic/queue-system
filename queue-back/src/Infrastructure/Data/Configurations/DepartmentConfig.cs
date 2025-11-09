using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cronly_back.Infrastructure.Data.Configurations;

public class DepartmentConfig : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Departments");
        
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id")
            .UseIdentityColumn();
        
        builder.Property(x => x.Name)
            .HasColumnName("Name")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(x => x.Code)
            .HasColumnName("Code")
            .HasColumnType("varchar(10)")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasColumnName("Description")
            .HasColumnType("varchar(500)")
            .HasMaxLength(500)
            .IsRequired(false);

        builder.Property(x => x.Capacity)
            .HasColumnName("Capacity")
            .HasDefaultValue(1)
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

        builder.HasIndex(x => x.Code)
            .IsUnique()
            .HasDatabaseName("IX_Departments_Code");

        builder.HasIndex(x => x.Name)
            .HasDatabaseName("IX_Departments_Name");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Departments_Status");
    }
}