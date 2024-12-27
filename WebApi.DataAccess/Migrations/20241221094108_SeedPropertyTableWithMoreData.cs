using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SeedPropertyTableWithMoreData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 21, 11, 41, 8, 271, DateTimeKind.Local).AddTicks(1592));

            migrationBuilder.InsertData(
                table: "Properties",
                columns: new[] { "Id", "City", "Cost", "Description", "Image", "LastUpdatedBy", "LastUpdatedOn", "Name", "Type", "model", "texture" },
                values: new object[,]
                {
                    { 2, "Johannesburg", 1000f, "Experience tranquility and modern living in this beautiful sanctuary home townhouse located in the vibrant city of Johannesburg. This residence combines contemporary design with a serene atmosphere, providing the perfect escape from the bustling city life.", "2.jpg", 0, new DateTime(2024, 12, 21, 11, 41, 8, 271, DateTimeKind.Local).AddTicks(1605), "Sanctuary home", "Townhouse", "2.glb", "2.jpg" },
                    { 3, "Johannesburg", 2000f, "Welcome to this stylish condo in the heart of Johannesburg, offering modern living in a prime urban setting. This well-appointed flat provides a perfect blend of comfort and convenience, ideal for city dwellers seeking a vibrant lifestyle. Located in a desirable neighborhood, the condo offers easy access to Johannesburg's top attractions, shopping centers, dining spots, and cultural landmarks. The building features secure access, ensuring a safe and peaceful living environment.", "3.jpg", 0, new DateTime(2024, 12, 21, 11, 41, 8, 271, DateTimeKind.Local).AddTicks(1607), "The Condo", "Flat", "", "" },
                    { 4, "Durban", 1500f, "Discover refined living in this elegant townhouse located in the sought-after Craven Hills neighborhood of Durban. This residence offers a harmonious blend of contemporary design and comfort, making it an ideal home for those seeking both style and convenience.", "4.jpg", 0, new DateTime(2024, 12, 21, 11, 41, 8, 271, DateTimeKind.Local).AddTicks(1609), "Craven hills", "Townhouse", "", "" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdatedOn",
                value: new DateTime(2024, 12, 21, 9, 13, 28, 895, DateTimeKind.Local).AddTicks(8852));
        }
    }
}
