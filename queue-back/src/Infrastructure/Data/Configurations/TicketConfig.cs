using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace cronly_back.Infrastructure.Data.Configurations;

public class TicketConfig : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.ToTable("Tickets");
        
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id")
            .UseIdentityColumn();

        builder.Property(x => x.TicketCode)
            .HasColumnName("TicketNumber")
            .HasColumnType("varchar(50)")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.QueueId)
            .HasColumnName("QueueId")
            .IsRequired();

        builder.Property(x => x.CitizenId)
            .HasColumnName("CitizenId")
            .IsRequired();

        builder.Property(x => x.TicketStatus)
            .HasColumnName("TicketStatus")
            .HasConversion<int>()
            .HasDefaultValue(TicketStatus.Waiting)
            .IsRequired();

        builder.Property(x => x.Priority)
            .HasColumnName("Priority")
            .HasConversion<int>()
            .HasDefaultValue(TicketPriority.Normal)
            .IsRequired();

        builder.Property(x => x.IssuedAt)
            .HasColumnName("IssuedAt")
            .HasColumnType("timestamptz")
            .HasDefaultValueSql("NOW()")
            .IsRequired();

        builder.Property(x => x.CalledAt)
            .HasColumnName("CalledAt")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder.Property(x => x.StartedAt)
            .HasColumnName("StartedAt")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder.Property(x => x.CompletedAt)
            .HasColumnName("CompletedAt")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder.Property(x => x.CancelledAt)
            .HasColumnName("CancelledAt")
            .HasColumnType("timestamptz")
            .IsRequired(false);

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

        // Índices
        builder.HasIndex(x => x.TicketCode)
            .HasDatabaseName("IX_Tickets_TicketNumber")
            .IsUnique();

        builder.HasIndex(x => x.QueueId)
            .HasDatabaseName("IX_Tickets_QueueId");

        builder.HasIndex(x => x.CitizenId)
            .HasDatabaseName("IX_Tickets_CitizenId");

        builder.HasIndex(x => x.TicketStatus)
            .HasDatabaseName("IX_Tickets_Status");

        builder.HasIndex(x => x.IssuedAt)
            .HasDatabaseName("IX_Tickets_IssuedAt");

        builder.HasOne(t => t.Citizen)
            .WithMany(c => c.Tickets)
            .HasForeignKey(t => t.CitizenId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_Tickets_Citizens");

        builder.HasOne(t => t.Queue)
            .WithMany(q => q.Tickets)
            .HasForeignKey(t => t.QueueId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_Tickets_Queues");
    }
}