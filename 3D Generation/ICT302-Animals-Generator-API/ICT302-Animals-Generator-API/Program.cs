using ICT302_Animals_Generator_API.Util;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var cors = "_localCORSOrigins";
// Allowing Cross-Origin from frontend to API via localhost on different ports
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: cors, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://10.51.33.50", "http://localhost:*", "http://17.19.0.1", "https://api.wildvision.co", "https://wildvision.co", "*/*");
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<SecurityMaster>(); // Security master for auth request checking

builder.WebHost.UseKestrel();

var app = builder.Build();

bool.TryParse(builder.Configuration["EnableSwagger"], out var enable);
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || enable)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
