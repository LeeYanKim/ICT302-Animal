using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;

namespace ICT302_BackendAPI.Database.Models;

public class SchemaContext : DbContext
{
    private readonly ILogger<SchemaContext> _logger;
    private readonly string _connectionString;
    private const int CommandTimeout = 60;

    public SchemaContext(IConfiguration configuration, ILogger<SchemaContext> logger)
    {
        _logger = logger;
        
        var fallbackConnectionString = "server=10.51.33.50;port=3306;user=api;password=APIPass!;database=it01-animals";
        var mainConnection = configuration.GetConnectionString("wildVisionDB");
        var backupConnection = configuration.GetConnectionString("wildVisionDB-Backup");
        _connectionString = mainConnection ?? backupConnection ?? fallbackConnectionString;
        
        // Logging the server= portion of the connection string
        _logger.LogInformation("Connection to MySQL {server}", _connectionString.Split(";")[0]);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        try
        {
            //TODO: Add more checks for connection errors to prevent the app from crashing
            
            optionsBuilder.UseMySQL(_connectionString, op =>
            {
                op.CommandTimeout(CommandTimeout);
                op.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(10), errorNumbersToAdd: null);
            });
        
            optionsBuilder.EnableSensitiveDataLogging();
        }
        catch (MySqlException e)
        {
            _logger.LogError(e, "Error while connecting to MySQL");
        }
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<JobsPending>()
            .Property(job => job.Status)
            .HasConversion(
                v => v.ToString(), // Converts job status enum to string
                v => (JobStatus)Enum.Parse(typeof(JobStatus), v) // Converts string to job status
            );
    }

    /**
     * <summary>Checks if the Database is available.</summary>
     *
     * <returns>True if the database is available and false if not</returns>
     *
     * <remarks>This function only trys to open a connection to the database and returns if the database is available.
     * It does not check if the database is up-to-date with the current schema/creation</remarks>
     */
    public async Task<bool> CheckDbIsAvailable()
    {
        try
        {
            await Database.OpenConnectionAsync();
            await Database.CloseConnectionAsync();
        }
        catch (MySqlException e)
        {
            _logger.LogError("Cannot open connection to MySQL: {message}", e.Message);
            if(e.Number == -2)
                _logger.LogError("MySQL connection timed out: {message}", e.Message);
            return false;
        }

        return true;
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
