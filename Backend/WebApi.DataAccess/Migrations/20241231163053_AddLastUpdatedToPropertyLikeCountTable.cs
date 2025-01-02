using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddLastUpdatedToPropertyLikeCountTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LastUpdatedBy",
                table: "PropertyLikeCount",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdatedOn",
                table: "PropertyLikeCount",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(7947));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(7952));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(7954));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(7955));

            migrationBuilder.UpdateData(
                table: "PropertyLikeCount",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "LastUpdatedBy", "LastUpdatedOn" },
                values: new object[] { 0, new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(8129) });

            migrationBuilder.UpdateData(
                table: "PropertyLikeCount",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "LastUpdatedBy", "LastUpdatedOn" },
                values: new object[] { 0, new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(8131) });

            migrationBuilder.UpdateData(
                table: "PropertyLikeCount",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "LastUpdatedBy", "LastUpdatedOn" },
                values: new object[] { 0, new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(8132) });

            migrationBuilder.UpdateData(
                table: "PropertyLikeCount",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "LastUpdatedBy", "LastUpdatedOn" },
                values: new object[] { 0, new DateTime(2024, 12, 31, 16, 30, 50, 687, DateTimeKind.Utc).AddTicks(8133) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUpdatedBy",
                table: "PropertyLikeCount");

            migrationBuilder.DropColumn(
                name: "LastUpdatedOn",
                table: "PropertyLikeCount");

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 29, 9, 7, 5, 738, DateTimeKind.Utc).AddTicks(7447));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 29, 9, 7, 5, 738, DateTimeKind.Utc).AddTicks(7452));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 29, 9, 7, 5, 738, DateTimeKind.Utc).AddTicks(7454));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 29, 9, 7, 5, 738, DateTimeKind.Utc).AddTicks(7456));
        }
    }
}
