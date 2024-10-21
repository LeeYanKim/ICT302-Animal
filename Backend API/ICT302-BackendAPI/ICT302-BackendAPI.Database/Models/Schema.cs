using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

#pragma warning disable CS8618
namespace ICT302_BackendAPI.Database.Models;

[Table("accesstype")]
public class AccessType
{
    [Key]
    [Column("AccessType_ID", TypeName = "binary(16)")]
    public Guid AccessTypeID { get; set; }

    [Required]
    [Column("AccessType_Details", TypeName = "varchar(45)")]
    [StringLength(45)]
    public string AccessTypeDetails { get; set; }
}

[Table("animal")]
public class Animal
    {
        [Key]
        [Column("Animal_ID", TypeName = "binary(16)")]
        public Guid AnimalID { get; set; }

        [Required]
        [Column("Animal_Name", TypeName = "varchar(45)")]
        [StringLength(45)]
        public string AnimalName { get; set; }

        [Required]
        [Column("Animal_DOB", TypeName = "date")]
        [DataType(DataType.Date)]
        public DateTime AnimalDOB { get; set; }

        [Required]
        [Column("Animal_Type", TypeName = "varchar(45)")]
        [StringLength(45)]
        public string AnimalType { get; set; }
        
       // Navigation property
        public virtual ICollection<Graphic> Graphics { get; set; } = new List<Graphic>();

    }

[Table("animalaccess")]
public class AnimalAccess
{
    [Key]
    [Column("Access_ID", TypeName = "binary(16)")]
    public Guid AccessID { get; set; }

    [Required]
    [Column("Access_Type", TypeName = "varchar(25)")]
    [StringLength(25)]
    public string AccessType { get; set; }

    [Required]
    [Column("Assigned_Date", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime AssignedDate { get; set; }

    [Required]
    [Column("Animal_ID", TypeName = "binary(16)")]
    public Guid AnimalID { get; set; }

    [Required]
    [Column("User_ID", TypeName = "binary(16)")]
    public Guid UserID { get; set; }

    [ForeignKey("AnimalID")]
    public virtual Animal Animal { get; set; }

    [ForeignKey("UserID")]
    public virtual User User { get; set; }
}

[Table("billing")]
public class Billing
{
    [Key]
    [Column("Billing_ID", TypeName = "binary(16)")]
    public Guid BillingID { get; set; }

    [Required]
    [Column("GPC_ID", TypeName = "binary(16)")]
    public Guid GPCID { get; set; }

    [Required]
    [Column("Job_ID", TypeName = "binary(16)")]
    public Guid JobID { get; set; }

    [Required]
    [Column("User_ID", TypeName = "binary(16)")]
    public Guid UserID { get; set; }

    [Required]
    [Column("Subscription_ID", TypeName = "binary(16)")]
    public Guid SubscriptionID { get; set; }

    [ForeignKey("GPCID")]
    public virtual Graphic Graphic { get; set; }

    [ForeignKey("JobID")]
    public virtual JobsCompleted JobsCompleted { get; set; }

    [ForeignKey("UserID")]
    public virtual User User { get; set; }

    [ForeignKey("SubscriptionID")]
    public virtual Subscription Subscription { get; set; }
}

[Table("graphic")]
public class Graphic
{
    [Key]
    [Column("GPC_ID", TypeName = "binary(16)")]
    public Guid GPCID { get; set; }

    [Required]
    [Column("GPC_Name", TypeName = "varchar(255)")]
    [StringLength(255)]
    public string GPCName { get; set; }

    [Required]
    [Column("GPC_Date_Upload", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime GPCDateUpload { get; set; }

    [Required]
    [Column("File_Path", TypeName = "varchar(255)")]
    [StringLength(45)]
    public string FilePath { get; set; }

    [Required]
    [Column("Animal_ID", TypeName = "binary(16)")]
    public Guid AnimalID { get; set; }

    [Required]
    [Column("GPC_Size", TypeName = "int")]
    public int GPCSize { get; set; }

    [ForeignKey("AnimalID")]
    public virtual Animal? Animal { get; set; }
    
}

[Table("jobdetails")]
public class JobDetails
{
    [Key]
    [Column("JD_ID", TypeName = "binary(16)")]
    public Guid JDID { get; set; }

    [Required]
    [Column("GPC_ID", TypeName = "binary(16)")]
    public Guid GPCID { get; set; }

    [Required]
    [Column("Model_ID", TypeName = "binary(16)")]
    public Guid ModelID { get; set; }

    [Required]
    [Column("Model_Gen_Type", TypeName = "varchar(45)")]
    [StringLength(45)]
    public string ModelGenType { get; set; }

    [ForeignKey("GPCID")]
    public virtual Graphic? Graphic { get; set; }

    [ForeignKey("ModelID")]
    public virtual Model3D? Model3D { get; set; }
    
}

[Table("jobscompleted")]
public class JobsCompleted
{
    [Key]
    [Column("Job_ID", TypeName = "binary(16)")]
    public Guid JobID { get; set; }

    [Required]
    [Column("Job_Type", TypeName = "varchar(45)")]
    [StringLength(45)]
    public string JobType { get; set; }

    [Required]
    [Column("Jobs_Start", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime JobsStart { get; set; }

    [Required]
    [Column("Jobs_End", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime JobsEnd { get; set; }

    [Required]
    [Column("Job_Size", TypeName = "int")]
    public int JobSize { get; set; }

    [Required]
    [Column("JD_ID", TypeName = "binary(16)")]
    public Guid JDID { get; set; }

    [ForeignKey("JDID")]
    public virtual JobDetails JobDetails { get; set; }
}

[Table("jobspending")]
public class JobsPending
{
    [Key]
    [Column("Queue_Number", TypeName = "int")]
    public int QueueNumber { get; set; } = -1;

    [Required]
    [Column("Job_Added", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime JobAdded { get; set; }

    [Required]
    [Column("Status", TypeName = "char(35)")]
    [StringLength(35)]
    public JobStatus Status { get; set; }

    [Required]
    [Column("JD_ID", TypeName = "binary(16)")]
    public Guid JobDetailsId { get; set; }

    [ForeignKey("JDID")]
    public virtual JobDetails JobDetails { get; set; }
}

[Table("model3d")]
public class Model3D
{
    [Key]
    [Column("Model_ID", TypeName = "binary(16)")]
    public Guid ModelID { get; set; }

    [Required]
    [Column("Model_Title", TypeName = "varchar(255)")]
    [StringLength(255)]
    public string ModelTitle { get; set; }

    [Required]
    [Column("Model_Date_Gen", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime ModelDateGen { get; set; }

    [Required]
    [Column("File_Path", TypeName = "varchar(255)")]
    [StringLength(255)]
    public string FilePath { get; set; }

    [Required]
    [Column("GPC_ID", TypeName = "binary(16)")]
    public Guid GPCID { get; set; }

    [ForeignKey("GPCID")]
    public virtual Graphic? Graphic { get; set; }
}

[Table("org_requests")]
public class OrgRequests
{
    [Key]
    [Column("Request_ID", TypeName = "binary(16)")]
    public Guid RequestID { get; set; }

    [Required]
    [Column("Org_ID", TypeName = "binary(16)")]
    public Guid OrgID { get; set; }

    [Required]
    [Column("User_ID", TypeName = "binary(16)")]
    public Guid UserID { get; set; }

    [Required]
    [Column("Date_Requested", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime DateRequested { get; set; }

    [Column("Date_Processed", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime? DateProcessed { get; set; }

    [Column("Status", TypeName = "varchar(45)")]
    [StringLength(45)]
    public string Status { get; set; }

    [ForeignKey("OrgID")]
    public virtual Organisation Organisation { get; set; }

    [ForeignKey("UserID")]
    public virtual User User { get; set; }
}

[Table("organisation")]
public class Organisation
{
    [Key]
    [Column("Org_ID", TypeName = "binary(16)")]
    public Guid OrgID { get; set; }

    [Required]
    [Column("Org_Name", TypeName = "varchar(45)")]
    [StringLength(45)]
    public string OrgName { get; set; }

    [Column("Org_Email", TypeName = "varchar(255)")]
    [StringLength(255)]
    public string? OrgEmail { get; set; }
}

[Table("organisationaccess")]
public class OrganisationAccess
{
    [Key]
    [Column("OrgAccess_ID", TypeName = "binary(16)")]
    public Guid OrgAccessID { get; set; }

    [Required]
    [Column("Access_Type", TypeName = "varchar(45)")]
    [StringLength(45)]
    public string AccessType { get; set; }

    [Required]
    [Column("Assigned_Date", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime AssignedDate { get; set; }

    [Required]
    [Column("Org_ID", TypeName = "binary(16)")]
    public Guid OrgID { get; set; }

    [Required]
    [Column("Access_ID", TypeName = "binary(16)")]
    public Guid AccessID { get; set; }

    [ForeignKey("OrgID")]
    public virtual Organisation Organisation { get; set; }

    [ForeignKey("AccessID")]
    public virtual AnimalAccess AnimalAccess { get; set; }
}

[Table("subscription")]
public class Subscription
{
    [Key]
    [Column("Subscription_ID", TypeName = "binary(16)")]
    public Guid SubscriptionID { get; set; }

    [Required]
    [Column("Subscription_Title", TypeName = "varchar(45)")]
    [StringLength(45)]
    public string SubscriptionTitle { get; set; }

    [Required]
    [Column("Storage_Size", TypeName = "int")]
    public int StorageSize { get; set; }

    [Required]
    [Column("Charge_Rate", TypeName = "int")]
    public int ChargeRate { get; set; }
}

[Table("transaction")]
public class Transaction
{
    [Key]
    [Column("Transaction_ID", TypeName = "binary(16)")]
    public Guid TransactionID { get; set; }

    [Required]
    [Column("TransType_ID", TypeName = "binary(16)")]
    public Guid TransTypeID { get; set; }

    [Required]
    [Column("User_ID", TypeName = "binary(16)")]
    public Guid UserID { get; set; }

    [Required]
    [Column("Animal_ID", TypeName = "binary(16)")]
    public Guid AnimalID { get; set; }

    [ForeignKey("TransTypeID")]
    public virtual TransactionType TransactionType { get; set; }

    [ForeignKey("UserID")]
    public virtual User User { get; set; }

    [ForeignKey("AnimalID")]
    public virtual Animal Animal { get; set; }
}

[Table("transactiontype")]
public class TransactionType
{
    [Key]
    [Column("TransType_ID", TypeName = "binary(16)")]
    public Guid TransTypeID { get; set; }

    [Required]
    [Column("Trans_Details", TypeName = "varchar(255)")]
    [StringLength(255)]
    public string TransDetails { get; set; }
}

[Table("user")]
public class User
{
    [Key]
    [Column("User_ID", TypeName = "binary(16)")]
    public Guid UserID { get; set; }

    [Required]
    [Column("Permission_Level", TypeName = "char(10)")]
    [StringLength(10)]
    public string PermissionLevel { get; set; }

    [Required]
    [Column("User_Name", TypeName = "varchar(255)")]
    [StringLength(255)]
    public string UserName { get; set; }

    [Required]
    [Column("User_Email", TypeName = "varchar(255)")]
    [StringLength(255)]
    public string UserEmail { get; set; }

    [Required]
    [Column("User_Password", TypeName = "varchar(12)")]
    [StringLength(12)]
    public string UserPassword { get; set; }

    [Required]
    [Column("User_Date_Join", TypeName = "date")]
    [DataType(DataType.Date)]
    public DateTime UserDateJoin { get; set; }

    [Required]
    [Column("subscription_ID", TypeName = "binary(16)")]
    public Guid SubscriptionID { get; set; }

    [ForeignKey("SubscriptionID")]
    public virtual Subscription Subscription { get; set; }
}

[Table("useraccess")]
[PrimaryKey(nameof(OrgID), nameof(UserID))]
public class UserAccess
{
    [Column("Org_ID", TypeName = "binary(16)", Order = 0)]
    public Guid OrgID { get; set; }

    [Column("User_ID", TypeName = "binary(16)", Order = 1)]
    public Guid UserID { get; set; }

    [Required]
    [Column("AccessType_ID", TypeName = "binary(16)")]
    public Guid AccessTypeID { get; set; }

    [ForeignKey("OrgID")]
    public virtual Organisation Organisation { get; set; }

    [ForeignKey("UserID")]
    public virtual User User { get; set; }

    [ForeignKey("AccessTypeID")]
    public virtual AccessType AccessType { get; set; }
}

