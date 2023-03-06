using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VabucherBack.Migrations
{
    public partial class addUserColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "codeValidation",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "isConfirmed",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "codeValidation",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "isConfirmed",
                table: "Users");
        }
    }
}
