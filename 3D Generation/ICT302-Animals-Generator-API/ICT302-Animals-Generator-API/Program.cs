using ICT302_Animals_Generator_API.Util;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var cors = "_localCORSOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: cors, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://10.51.33.50", "http://localhost:*", "http://17.19.0.1", "https://api.wildvision.co", "https://wildvision.co", "https://*.vectorpixel.net");
    });
});

builder.WebHost.UseUrls("http://0.0.0.0:5000");

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<SecurityMaster>(); // Security master for auth request checking

builder.Services.AddLogging();


var app = builder.Build();



var enableSwagger = builder.Configuration.GetValue<bool>("EnableSwagger");
Console.WriteLine("Swagger Enabled? : {0}", enableSwagger);

if (enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.MapDefaultControllerRoute();


app.Run();
