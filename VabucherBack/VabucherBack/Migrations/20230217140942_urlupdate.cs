using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VabucherBack.Migrations
{
    public partial class urlupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "JobOffers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url",
                table: "JobOffers");
        }
    }
}
