using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreatePropertyLikeAndPropertyLikeCountTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "texture",
                table: "Properties",
                newName: "Texture");

            migrationBuilder.RenameColumn(
                name: "model",
                table: "Properties",
                newName: "Model");

            migrationBuilder.CreateTable(
                name: "PropertyLike",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LastUpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastUpdatedBy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyLike", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyLike_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PropertyLike_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PropertyLikeCount",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyLikeCount", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyLikeCount_Properties_Id",
                        column: x => x.Id,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 18, 21, 25, 837, DateTimeKind.Utc).AddTicks(693));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 18, 21, 25, 837, DateTimeKind.Utc).AddTicks(698));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 18, 21, 25, 837, DateTimeKind.Utc).AddTicks(700));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 18, 21, 25, 837, DateTimeKind.Utc).AddTicks(702));

            migrationBuilder.InsertData(
                table: "PropertyLikeCount",
                columns: new[] { "Id", "Count" },
                values: new object[,]
                {
                    { 1, 0 },
                    { 2, 0 },
                    { 3, 0 },
                    { 4, 0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyLike_PropertyId",
                table: "PropertyLike",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyLike_UserId",
                table: "PropertyLike",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyLike");

            migrationBuilder.DropTable(
                name: "PropertyLikeCount");

            migrationBuilder.RenameColumn(
                name: "Texture",
                table: "Properties",
                newName: "texture");

            migrationBuilder.RenameColumn(
                name: "Model",
                table: "Properties",
                newName: "model");

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 16, 11, 25, 936, DateTimeKind.Utc).AddTicks(6553));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 16, 11, 25, 936, DateTimeKind.Utc).AddTicks(6599));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 16, 11, 25, 936, DateTimeKind.Utc).AddTicks(6602));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 28, 16, 11, 25, 936, DateTimeKind.Utc).AddTicks(6603));
        }
    }
}
