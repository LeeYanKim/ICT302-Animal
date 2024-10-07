using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ICT302_BackendAPI.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "accesstype",
                columns: table => new
                {
                    AccessType_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    AccessType_Details = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_accesstype", x => x.AccessType_ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "animal",
                columns: table => new
                {
                    Animal_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Animal_Name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    Animal_DOB = table.Column<DateTime>(type: "date", nullable: false),
                    Animal_Type = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    Video_File_Name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    Video_Upload_Date = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_animal", x => x.Animal_ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "organisation",
                columns: table => new
                {
                    Org_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Org_Name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    Org_Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organisation", x => x.Org_ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "subscription",
                columns: table => new
                {
                    Subscription_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Subscription_Title = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    Storage_Size = table.Column<int>(type: "int", nullable: false),
                    Charge_Rate = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subscription", x => x.Subscription_ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "transactiontype",
                columns: table => new
                {
                    TransType_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Trans_Details = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transactiontype", x => x.TransType_ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    User_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Permission_Level = table.Column<string>(type: "char(10)", maxLength: 10, nullable: false),
                    User_Name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    User_Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    User_Password = table.Column<string>(type: "varchar(12)", maxLength: 12, nullable: false),
                    User_Date_Join = table.Column<DateTime>(type: "date", nullable: false),
                    subscription_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.User_ID);
                    table.ForeignKey(
                        name: "FK_user_subscription_subscription_ID",
                        column: x => x.subscription_ID,
                        principalTable: "subscription",
                        principalColumn: "Subscription_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "animalaccess",
                columns: table => new
                {
                    Access_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Access_Type = table.Column<string>(type: "varchar(25)", maxLength: 25, nullable: false),
                    Assigned_Date = table.Column<DateTime>(type: "date", nullable: false),
                    Animal_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    User_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_animalaccess", x => x.Access_ID);
                    table.ForeignKey(
                        name: "FK_animalaccess_animal_Animal_ID",
                        column: x => x.Animal_ID,
                        principalTable: "animal",
                        principalColumn: "Animal_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_animalaccess_user_User_ID",
                        column: x => x.User_ID,
                        principalTable: "user",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "org_requests",
                columns: table => new
                {
                    Request_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Org_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    User_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Date_Requested = table.Column<DateTime>(type: "date", nullable: false),
                    Date_Processed = table.Column<DateTime>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_org_requests", x => x.Request_ID);
                    table.ForeignKey(
                        name: "FK_org_requests_organisation_Org_ID",
                        column: x => x.Org_ID,
                        principalTable: "organisation",
                        principalColumn: "Org_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_org_requests_user_User_ID",
                        column: x => x.User_ID,
                        principalTable: "user",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "transaction",
                columns: table => new
                {
                    Transaction_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    TransType_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    User_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Animal_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transaction", x => x.Transaction_ID);
                    table.ForeignKey(
                        name: "FK_transaction_animal_Animal_ID",
                        column: x => x.Animal_ID,
                        principalTable: "animal",
                        principalColumn: "Animal_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_transaction_transactiontype_TransType_ID",
                        column: x => x.TransType_ID,
                        principalTable: "transactiontype",
                        principalColumn: "TransType_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_transaction_user_User_ID",
                        column: x => x.User_ID,
                        principalTable: "user",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "organisationaccess",
                columns: table => new
                {
                    OrgAccess_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Access_Type = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    Assigned_Date = table.Column<DateTime>(type: "date", nullable: false),
                    Org_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Access_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organisationaccess", x => x.OrgAccess_ID);
                    table.ForeignKey(
                        name: "FK_organisationaccess_animalaccess_Access_ID",
                        column: x => x.Access_ID,
                        principalTable: "animalaccess",
                        principalColumn: "Access_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_organisationaccess_organisation_Org_ID",
                        column: x => x.Org_ID,
                        principalTable: "organisation",
                        principalColumn: "Org_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "billing",
                columns: table => new
                {
                    Billing_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    GPC_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Job_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    User_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Subscription_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_billing", x => x.Billing_ID);
                    table.ForeignKey(
                        name: "FK_billing_subscription_Subscription_ID",
                        column: x => x.Subscription_ID,
                        principalTable: "subscription",
                        principalColumn: "Subscription_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_billing_user_User_ID",
                        column: x => x.User_ID,
                        principalTable: "user",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "graphic",
                columns: table => new
                {
                    GPC_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    GPC_Name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    GPC_Date_Upload = table.Column<DateTime>(type: "date", nullable: false),
                    File_Path = table.Column<string>(type: "varchar(255)", maxLength: 45, nullable: false),
                    Animal_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    GPC_Size = table.Column<int>(type: "int", nullable: false),
                    Billing_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_graphic", x => x.GPC_ID);
                    table.ForeignKey(
                        name: "FK_graphic_animal_Animal_ID",
                        column: x => x.Animal_ID,
                        principalTable: "animal",
                        principalColumn: "Animal_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_graphic_billing_Billing_ID",
                        column: x => x.Billing_ID,
                        principalTable: "billing",
                        principalColumn: "Billing_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "model3d",
                columns: table => new
                {
                    Model_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Model_Title = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    Model_Date_Gen = table.Column<DateTime>(type: "date", nullable: false),
                    File_Path = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    GPC_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_model3d", x => x.Model_ID);
                    table.ForeignKey(
                        name: "FK_model3d_graphic_GPC_ID",
                        column: x => x.GPC_ID,
                        principalTable: "graphic",
                        principalColumn: "GPC_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "jobdetails",
                columns: table => new
                {
                    JD_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    GPC_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Model_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Model_Gen_Type = table.Column<string>(type: "varchar(45)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jobdetails", x => x.JD_ID);
                    table.ForeignKey(
                        name: "FK_jobdetails_graphic_GPC_ID",
                        column: x => x.GPC_ID,
                        principalTable: "graphic",
                        principalColumn: "GPC_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_jobdetails_model3d_Model_ID",
                        column: x => x.Model_ID,
                        principalTable: "model3d",
                        principalColumn: "Model_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "jobscompleted",
                columns: table => new
                {
                    Job_ID = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Job_Type = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false),
                    Jobs_Start = table.Column<DateTime>(type: "date", nullable: false),
                    Jobs_End = table.Column<DateTime>(type: "date", nullable: false),
                    Job_Size = table.Column<int>(type: "int", nullable: false),
                    JD_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jobscompleted", x => x.Job_ID);
                    table.ForeignKey(
                        name: "FK_jobscompleted_jobdetails_JD_ID",
                        column: x => x.JD_ID,
                        principalTable: "jobdetails",
                        principalColumn: "JD_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "jobspending",
                columns: table => new
                {
                    Queue_Number = table.Column<byte[]>(type: "binary(16)", nullable: false),
                    Job_Added = table.Column<DateTime>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "char(35)", maxLength: 35, nullable: false),
                    JD_ID = table.Column<byte[]>(type: "binary(16)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jobspending", x => x.Queue_Number);
                    table.ForeignKey(
                        name: "FK_jobspending_jobdetails_JD_ID",
                        column: x => x.JD_ID,
                        principalTable: "jobdetails",
                        principalColumn: "JD_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_animalaccess_Animal_ID",
                table: "animalaccess",
                column: "Animal_ID");

            migrationBuilder.CreateIndex(
                name: "IX_animalaccess_User_ID",
                table: "animalaccess",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_billing_GPC_ID",
                table: "billing",
                column: "GPC_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_billing_Job_ID",
                table: "billing",
                column: "Job_ID");

            migrationBuilder.CreateIndex(
                name: "IX_billing_Subscription_ID",
                table: "billing",
                column: "Subscription_ID");

            migrationBuilder.CreateIndex(
                name: "IX_billing_User_ID",
                table: "billing",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_graphic_Animal_ID",
                table: "graphic",
                column: "Animal_ID");

            migrationBuilder.CreateIndex(
                name: "IX_graphic_Billing_ID",
                table: "graphic",
                column: "Billing_ID");

            migrationBuilder.CreateIndex(
                name: "IX_jobdetails_GPC_ID",
                table: "jobdetails",
                column: "GPC_ID");

            migrationBuilder.CreateIndex(
                name: "IX_jobdetails_Model_ID",
                table: "jobdetails",
                column: "Model_ID");

            migrationBuilder.CreateIndex(
                name: "IX_jobscompleted_JD_ID",
                table: "jobscompleted",
                column: "JD_ID");

            migrationBuilder.CreateIndex(
                name: "IX_jobspending_JD_ID",
                table: "jobspending",
                column: "JD_ID");

            migrationBuilder.CreateIndex(
                name: "IX_model3d_GPC_ID",
                table: "model3d",
                column: "GPC_ID");

            migrationBuilder.CreateIndex(
                name: "IX_org_requests_Org_ID",
                table: "org_requests",
                column: "Org_ID");

            migrationBuilder.CreateIndex(
                name: "IX_org_requests_User_ID",
                table: "org_requests",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_organisationaccess_Access_ID",
                table: "organisationaccess",
                column: "Access_ID");

            migrationBuilder.CreateIndex(
                name: "IX_organisationaccess_Org_ID",
                table: "organisationaccess",
                column: "Org_ID");

            migrationBuilder.CreateIndex(
                name: "IX_transaction_Animal_ID",
                table: "transaction",
                column: "Animal_ID");

            migrationBuilder.CreateIndex(
                name: "IX_transaction_TransType_ID",
                table: "transaction",
                column: "TransType_ID");

            migrationBuilder.CreateIndex(
                name: "IX_transaction_User_ID",
                table: "transaction",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_user_subscription_ID",
                table: "user",
                column: "subscription_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_billing_graphic_GPC_ID",
                table: "billing",
                column: "GPC_ID",
                principalTable: "graphic",
                principalColumn: "GPC_ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_billing_jobscompleted_Job_ID",
                table: "billing",
                column: "Job_ID",
                principalTable: "jobscompleted",
                principalColumn: "Job_ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_graphic_animal_Animal_ID",
                table: "graphic");

            migrationBuilder.DropForeignKey(
                name: "FK_billing_user_User_ID",
                table: "billing");

            migrationBuilder.DropForeignKey(
                name: "FK_billing_graphic_GPC_ID",
                table: "billing");

            migrationBuilder.DropForeignKey(
                name: "FK_jobdetails_graphic_GPC_ID",
                table: "jobdetails");

            migrationBuilder.DropForeignKey(
                name: "FK_model3d_graphic_GPC_ID",
                table: "model3d");

            migrationBuilder.DropTable(
                name: "accesstype");

            migrationBuilder.DropTable(
                name: "jobspending");

            migrationBuilder.DropTable(
                name: "org_requests");

            migrationBuilder.DropTable(
                name: "organisationaccess");

            migrationBuilder.DropTable(
                name: "transaction");

            migrationBuilder.DropTable(
                name: "animalaccess");

            migrationBuilder.DropTable(
                name: "organisation");

            migrationBuilder.DropTable(
                name: "transactiontype");

            migrationBuilder.DropTable(
                name: "animal");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "graphic");

            migrationBuilder.DropTable(
                name: "billing");

            migrationBuilder.DropTable(
                name: "jobscompleted");

            migrationBuilder.DropTable(
                name: "subscription");

            migrationBuilder.DropTable(
                name: "jobdetails");

            migrationBuilder.DropTable(
                name: "model3d");
        }
    }
}
