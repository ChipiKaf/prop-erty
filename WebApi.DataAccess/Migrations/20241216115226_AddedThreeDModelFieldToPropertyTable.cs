using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddedThreeDModelFieldToPropertyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ThreeD",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThreeD",
                table: "Properties");
        }
    }
}
