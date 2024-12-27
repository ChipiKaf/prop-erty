using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceBoolWithStringForThreeDObject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThreeD",
                table: "Properties");

            migrationBuilder.AddColumn<string>(
                name: "ThreeDObject",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThreeDObject",
                table: "Properties");

            migrationBuilder.AddColumn<bool>(
                name: "ThreeD",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
