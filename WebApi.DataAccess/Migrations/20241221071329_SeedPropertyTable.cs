using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SeedPropertyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Properties",
                columns: new[] { "Id", "City", "Cost", "Description", "Image", "LastUpdatedBy", "LastUpdatedOn", "Name", "Type", "model", "texture" },
                values: new object[] { 1, "Pretoria", 1000f, "Experience unparalleled luxury with this exquisite penthouse in a prestigious Pretoria estate. This stunning residence offers modern sophistication and timeless charm, making it the perfect retreat for an elevated lifestyle. Nestled in the heart of Pretoria, the estate provides easy access to upscale shopping, fine dining, and reputable schools, all within a serene, secure environment.", "1.jpg", 0, new DateTime(2024, 12, 21, 9, 13, 28, 895, DateTimeKind.Local).AddTicks(8852), "The Penthouse", "Estate", "4.glb", "3.jpg" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
