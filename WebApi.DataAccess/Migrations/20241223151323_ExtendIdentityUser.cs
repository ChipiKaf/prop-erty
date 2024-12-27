using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ExtendIdentityUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "AspNetUsers",
                type: "nvarchar(21)",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 17, 13, 22, 547, DateTimeKind.Local).AddTicks(6258));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 17, 13, 22, 547, DateTimeKind.Local).AddTicks(6276));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 17, 13, 22, 547, DateTimeKind.Local).AddTicks(6278));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 17, 13, 22, 547, DateTimeKind.Local).AddTicks(6280));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 15, 49, 43, 36, DateTimeKind.Local).AddTicks(3223));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 15, 49, 43, 36, DateTimeKind.Local).AddTicks(3235));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 15, 49, 43, 36, DateTimeKind.Local).AddTicks(3237));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 23, 15, 49, 43, 36, DateTimeKind.Local).AddTicks(3239));
        }
    }
}
