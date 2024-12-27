using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddedModelAndTextureField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ThreeDObject",
                table: "Properties",
                newName: "texture");

            migrationBuilder.AddColumn<string>(
                name: "model",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "model",
                table: "Properties");

            migrationBuilder.RenameColumn(
                name: "texture",
                table: "Properties",
                newName: "ThreeDObject");
        }
    }
}
