using ICT302_BackendAPI.API.Generation;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using System.Text.Json.Serialization;
using FirebaseAdmin;
using ICT302_BackendAPI.Firebase;
using NReco.Logging.File;
using ICT302_BackendAPI.Utility;

// Creating web app builder
var builder = WebApplication.CreateBuilder(args);

// Load Firebase config from appsettings
builder.Services.Configure<FirebaseConfig>(builder.Configuration.GetSection("Firebase"));
builder.Services.AddSingleton<FirebaseService>();

// Force port 5173 and opening on 0.0.0.0 as localhost is unreachable to external systems
builder.WebHost.UseUrls("http://0.0.0.0:5173");

// Registering file logger
builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole();
    loggingBuilder.AddFile("it01-backend-api.log", append: true);
});

// Allowing Cross-Origin from frontend to API via localhost on different ports
var cors = "_localCORSOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: cors, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://10.51.33.50", "http://localhost:*", "http://17.19.0.1", "https://api.wildvision.co", "https://wildvision.co", "https://www.wildvision.co", "https://www.api.wildvision.co")
        .AllowAnyMethod()
        .WithHeaders("Authorization", "Content-Type")
        .AllowCredentials();
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Registering Swagger API Explorer
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registering db context
builder.Services.AddTransient<SchemaContext>();

// Register db repositories
builder.Services.AddTransient<IAnimalRepository, AnimalRepository>();
builder.Services.AddTransient<IModel3DRepository, Model3DRepository>();
builder.Services.AddTransient<IAccessTypeRepository, AccessTypeRepository>();
builder.Services.AddTransient<IAnimalAccessRepository, AnimalAccessRepository>();
builder.Services.AddTransient<IBillingRepository, BillingRepository>();
builder.Services.AddTransient<IGraphicRepository, GraphicRepository>();
builder.Services.AddTransient<IJobsCompletedRepository, JobsCompletedRepository>();
builder.Services.AddTransient<IJobDetailsRepository, JobDetailsRepository>();
builder.Services.AddTransient<IJobsPendingRepository, JobsPendingRepository>();
builder.Services.AddTransient<IOrgRequestsRepository, OrgRequestsRepository>();
builder.Services.AddTransient<IOrganisationRepository, OrganisationRepository>();
builder.Services.AddTransient<IOrganisationAccessRepository, OrganisationAccessRepository>();
builder.Services.AddTransient<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddTransient<ITransactionRepository, TransactionRepository>();
builder.Services.AddTransient<ITransactionTypeRepository, TransactionTypeRepository>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IUserAccessRepository, UserAccessRepository>();

// Adding controllers
builder.Services.AddControllers();

// Registering generation job queue background services
builder.Services.AddSingleton<MonitorJobLoop>();
builder.Services.AddHostedService<QueuedJobService>();
builder.Services.AddSingleton<IBackgroundJobQueue>(_ => 
{
    if (!int.TryParse(builder.Configuration["JobQueueCapacity"], out var queueCapacity))
    {
        queueCapacity = 10;
    }

    return new BackgroundJobQueue(queueCapacity);
});

// Building App
var app = builder.Build();
app.Logger.LogInformation("Application starting...");

// Loading firebase config
var fb = app.Services.GetRequiredService<FirebaseService>();
FirebaseApp.Create(new AppOptions()
{
    Credential = fb.GetGoogleCredential()
});



// Setting up swagger ui
var enableSwagger = builder.Configuration.GetValue <bool>("EnableSwagger");
if (app.Environment.IsDevelopment() || enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Setting up Cors, Https, Routing and Controllers
app.UseHttpsRedirection();
app.UseCors(cors);
app.UseRouting();
app.MapControllers();

// Log app config to console and log file
var util = new Utility(app.Configuration, app.Logger, app.Environment);
util.PrintStartingConfig();

// Start the pending job queue monitor
MonitorJobLoop monitorJobLoop = app.Services.GetRequiredService<MonitorJobLoop>()!;
monitorJobLoop.StartMonitorLoop();

// Start the app
app.Run();