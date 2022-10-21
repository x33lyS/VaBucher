using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VabucherBack.Migrations
{
    public partial class Second_Push : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdUser",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Search",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Search",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "IdUser",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
