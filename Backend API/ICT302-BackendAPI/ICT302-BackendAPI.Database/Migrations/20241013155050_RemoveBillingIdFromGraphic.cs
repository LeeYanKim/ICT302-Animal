using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ICT302_BackendAPI.Database.Migrations
{
    /// <inheritdoc /
       public partial class RemoveBillingIdFromGraphic : Migration
{
   protected override void Up(MigrationBuilder migrationBuilder)
{
    // Drop the Billing_ID column from the graphic table
    migrationBuilder.DropColumn(
        name: "Billing_ID",
        table: "graphic"
    );


}

protected override void Down(MigrationBuilder migrationBuilder)
{
    // Re-add the Billing_ID column (in case you need to rollback)
    migrationBuilder.AddColumn<byte[]>(
        name: "Billing_ID",
        table: "graphic",
        type: "binary(16)",
        nullable: true);


}

}

    }

