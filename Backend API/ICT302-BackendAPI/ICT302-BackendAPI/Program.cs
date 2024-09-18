
using ICT302_BackendAPI.Backend_API;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.EntityFrameworkCore;

var  cors = "_localCORSOrigins";
var builder = WebApplication.CreateBuilder(args);


// Allowing Cross Origin from frontend to api via local host on different ports
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: cors, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000");
    });
});


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Adding Access to our custom Context
builder.Services.AddTransient<SchemaContext>();
builder.Services.AddTransient<ISchemaRepository, SchemaRepository>();
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

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});


//Setting up backend and database endpoints. In separate classes to keep this main program entry file short
//var backendEndPoints = new BackendEndPoints(app);


//var dbEndpoints = new DatabaseEndPoints(app);


app.Run();
