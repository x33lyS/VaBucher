using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VabucherBack.Migrations
{
    public partial class user2update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateLastConnection",
                table: "Users",
                newName: "DateLastConnexion");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateLastConnexion",
                table: "Users",
                newName: "DateLastConnection");
        }
    }
}
