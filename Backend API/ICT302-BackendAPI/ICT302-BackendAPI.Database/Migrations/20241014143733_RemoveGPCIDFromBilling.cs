﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ICT302_BackendAPI.Database.Migrations
{
    /// <inheritdoc />
    public partial class RemoveGPCIDFromBilling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_graphic_billing_Billing_ID",
                table: "graphic");

            migrationBuilder.DropIndex(
                name: "IX_graphic_Billing_ID",
                table: "graphic");

            migrationBuilder.DropIndex(
                name: "IX_billing_GPC_ID",
                table: "billing");

            migrationBuilder.DropColumn(
                name: "Billing_ID",
                table: "graphic");

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
                name: "IX_billing_GPC_ID",
                table: "billing",
                column: "GPC_ID");

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

            migrationBuilder.DropIndex(
                name: "IX_billing_GPC_ID",
                table: "billing");

            migrationBuilder.AddColumn<byte[]>(
                name: "Billing_ID",
                table: "graphic",
                type: "binary(16)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.CreateIndex(
                name: "IX_graphic_Billing_ID",
                table: "graphic",
                column: "Billing_ID");

            migrationBuilder.CreateIndex(
                name: "IX_billing_GPC_ID",
                table: "billing",
                column: "GPC_ID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_graphic_billing_Billing_ID",
                table: "graphic",
                column: "Billing_ID",
                principalTable: "billing",
                principalColumn: "Billing_ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}