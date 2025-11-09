using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace cronly_back.Migrations
{
    /// <inheritdoc />
    public partial class TicketConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartmentId1",
                table: "Queues",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TicketNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    QueueId = table.Column<int>(type: "integer", nullable: false),
                    CitizenId = table.Column<int>(type: "integer", nullable: false),
                    TicketStatus = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    Priority = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IssuedAt = table.Column<DateTime>(type: "timestamptz", nullable: false, defaultValueSql: "NOW()"),
                    CalledAt = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamptz", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamptz", nullable: true, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tickets_Citizens",
                        column: x => x.CitizenId,
                        principalTable: "Citizens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tickets_Queues",
                        column: x => x.QueueId,
                        principalTable: "Queues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Queues_DepartmentId1",
                table: "Queues",
                column: "DepartmentId1");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CitizenId",
                table: "Tickets",
                column: "CitizenId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_IssuedAt",
                table: "Tickets",
                column: "IssuedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_QueueId",
                table: "Tickets",
                column: "QueueId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_Status",
                table: "Tickets",
                column: "TicketStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketNumber",
                table: "Tickets",
                column: "TicketNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Queues_Departments_DepartmentId1",
                table: "Queues",
                column: "DepartmentId1",
                principalTable: "Departments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Queues_Departments_DepartmentId1",
                table: "Queues");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Queues_DepartmentId1",
                table: "Queues");

            migrationBuilder.DropColumn(
                name: "DepartmentId1",
                table: "Queues");
        }
    }
}
