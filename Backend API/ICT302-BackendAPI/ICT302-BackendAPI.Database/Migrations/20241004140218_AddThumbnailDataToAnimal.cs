using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ICT302_BackendAPI.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddThumbnailDataToAnimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Thumbnail_Data",
                table: "animal",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Video_Data",
                table: "animal",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Video_Upload_Date",
                table: "animal",
                type: "datetime",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "useraccess",
                columns: table => new
                {
                    Org_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    User_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    AccessType_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_useraccess", x => new { x.Org_ID, x.User_ID });
                    table.ForeignKey(
                        name: "FK_useraccess_accesstype_AccessType_ID",
                        column: x => x.AccessType_ID,
                        principalTable: "accesstype",
                        principalColumn: "AccessType_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_useraccess_organisation_Org_ID",
                        column: x => x.Org_ID,
                        principalTable: "organisation",
                        principalColumn: "Org_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_useraccess_user_User_ID",
                        column: x => x.User_ID,
                        principalTable: "user",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_useraccess_AccessType_ID",
                table: "useraccess",
                column: "AccessType_ID");

            migrationBuilder.CreateIndex(
                name: "IX_useraccess_User_ID",
                table: "useraccess",
                column: "User_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "useraccess");

            migrationBuilder.DropColumn(
                name: "Thumbnail_Data",
                table: "animal");

            migrationBuilder.DropColumn(
                name: "Video_Data",
                table: "animal");

            migrationBuilder.DropColumn(
                name: "Video_Upload_Date",
                table: "animal");
        }
    }
}
