using Microsoft.EntityFrameworkCore.Migrations;

namespace wafer_map_testing.Migrations
{
    public partial class ForthMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "Wafers");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Wafers");

            migrationBuilder.AddColumn<int>(
                name: "WaferMapDiesId",
                table: "Wafers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "WaferMapDies",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    Value = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaferMapDies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Wafers_WaferMapDiesId",
                table: "Wafers",
                column: "WaferMapDiesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wafers_WaferMapDies_WaferMapDiesId",
                table: "Wafers",
                column: "WaferMapDiesId",
                principalTable: "WaferMapDies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wafers_WaferMapDies_WaferMapDiesId",
                table: "Wafers");

            migrationBuilder.DropTable(
                name: "WaferMapDies");

            migrationBuilder.DropIndex(
                name: "IX_Wafers_WaferMapDiesId",
                table: "Wafers");

            migrationBuilder.DropColumn(
                name: "WaferMapDiesId",
                table: "Wafers");

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Wafers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Wafers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
