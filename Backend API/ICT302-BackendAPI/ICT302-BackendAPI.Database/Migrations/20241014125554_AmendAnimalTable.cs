using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ICT302_BackendAPI.Database.Migrations
{
    /// <inheritdoc />
    public partial class AmendAnimalTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Video_File_Name",
                table: "animal");

            migrationBuilder.DropColumn(
                name: "Video_Upload_Date",
                table: "animal");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Video_File_Name",
                table: "animal",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "Video_Upload_Date",
                table: "animal",
                type: "datetime",
                nullable: true);
        }
    }
}
