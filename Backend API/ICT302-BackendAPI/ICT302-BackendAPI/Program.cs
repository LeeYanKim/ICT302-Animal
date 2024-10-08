using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

var cors = "_localCORSOrigins";
var builder = WebApplication.CreateBuilder(args);

// Initialize Firebase Admin SDK
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile("wildvision-firebase-adminsdk.json") //To check
});

// Allowing Cross-Origin from frontend to API via localhost on different ports
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: cors, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://10.51.33.50", "http://localhost:*", "http://17.19.0.1", "https://api.wildvision.co", "https://wildvision.co")
        .WithHeaders("Authorization", "Content-Type")
        .AllowCredentials();
    });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Adding Access to our custom DB Context
builder.Services.AddTransient<SchemaContext>();

// Register repositories for Animal, Model3D, and AccessType
builder.Services.AddTransient<ISchemaRepository, SchemaRepository>(); // Animal Repository
builder.Services.AddTransient<IModel3DRepository, Model3DRepository>();
builder.Services.AddTransient<IAccessTypeRepository, AccessTypeRepository>(); // AccessType Repository
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

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(cors);

app.UseRouting();

#pragma warning disable ASP0014
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
