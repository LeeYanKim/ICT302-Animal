using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace ICT302_BackendAPI.Database.Migrations
{
    /// <inheritdoc />
    public partial class AmendJobsTablesUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_jobspending_jobdetails_JD_ID",
                table: "jobspending");

            migrationBuilder.DropIndex(
                name: "IX_jobspending_JD_ID",
                table: "jobspending");

            migrationBuilder.AlterColumn<int>(
                name: "Queue_Number",
                table: "jobspending",
                type: "int",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "binary(16)")
                .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<byte[]>(
                name: "JDID",
                table: "jobspending",
                type: "binary(16)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.CreateIndex(
                name: "IX_jobspending_JDID",
                table: "jobspending",
                column: "JDID");

            migrationBuilder.AddForeignKey(
                name: "FK_jobspending_jobdetails_JDID",
                table: "jobspending",
                column: "JDID",
                principalTable: "jobdetails",
                principalColumn: "JD_ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_jobspending_jobdetails_JDID",
                table: "jobspending");

            migrationBuilder.DropIndex(
                name: "IX_jobspending_JDID",
                table: "jobspending");

            migrationBuilder.DropColumn(
                name: "JDID",
                table: "jobspending");

            migrationBuilder.AlterColumn<byte[]>(
                name: "Queue_Number",
                table: "jobspending",
                type: "binary(16)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn);

            migrationBuilder.CreateIndex(
                name: "IX_jobspending_JD_ID",
                table: "jobspending",
                column: "JD_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_jobspending_jobdetails_JD_ID",
                table: "jobspending",
                column: "JD_ID",
                principalTable: "jobdetails",
                principalColumn: "JD_ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
