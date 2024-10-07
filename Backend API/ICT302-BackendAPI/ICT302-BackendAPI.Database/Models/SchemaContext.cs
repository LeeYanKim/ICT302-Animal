using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ICT302_BackendAPI.Database.Models;

public class SchemaContext : DbContext
{
    //private readonly IConfiguration _configuration;

    // TODO: Update this back to reading appsettings file rather than hard code a connection string
    private readonly string _connectionString = "server=10.51.33.50;port=3306;user=api;password=APIPass!;database=it01-animals"; // Main MySQL VM server

    public SchemaContext()
    {
        //_configuration = configuration;

        //Safty check for null connection string
        //string? connString = _configuration.GetConnectionString(name: "wildVisionDB");
        //string? connString = _configuration.GetConnectionString(name: "devDB");
        //_connectionString = connString != null ? connString : "";
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySQL(_connectionString);
    }


    public DbSet<Model3D> Model3D { get; set; }
    public DbSet<AccessType> AccessTypes { get; set; }
    public DbSet<Animal> Animals { get; set; }
    public DbSet<AnimalAccess> AnimalAccesses { get; set; }
    public DbSet<Billing> Billings { get; set; }
    public DbSet<Graphic> Graphics { get; set; }
    public DbSet<JobDetails> JobDetails { get; set; }
    public DbSet<JobsCompleted> JobsCompleted { get; set; }
    public DbSet<JobsPending> JobsPending { get; set; }
    public DbSet<Organisation> Organisations { get; set; }
    public DbSet<OrganisationAccess> OrganisationAccesses { get; set; }
    public DbSet<OrgRequests> OrgRequests { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<Transaction> Transaction { get; set; }
    public DbSet<TransactionType> TransactionType { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserAccess> UserAccess { get; set; }
}
