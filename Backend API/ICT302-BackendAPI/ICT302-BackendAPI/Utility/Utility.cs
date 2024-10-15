using System.Runtime.InteropServices;

namespace ICT302_BackendAPI.Utility;

public class Utility
{
    private readonly IConfiguration _configuration;
    private readonly ILogger _logger;
    private readonly IWebHostEnvironment _environment;

    public Utility(IConfiguration configuration, ILogger logger,IWebHostEnvironment environment)
    {
        _configuration = configuration;
        _logger = logger;
        _environment = environment;
    }
    
    public void PrintStartingConfig()
    {
        _logger.LogInformation("Starting with configuration:");
        string config = "App Environment: " + _environment.EnvironmentName +"\n";

        if (_environment.IsDevelopment())
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                config += "User Storage Path: " + _configuration["dev_StoredFilesPath_Linux"] +"\n";
                config += "User Thumbnail Path: " + _configuration["dev_StoredThumbs_Linux"] +"\n";
            }
            else
            {
                config += "User Storage Path: " + _configuration["dev_StoredFilesPath"] +"\n";
                config += "User Thumbnail Path: " + _configuration["dev_StoredThumbs"] +"\n";
            }
            
        }
        else
        {
            config += "User Storage Path: " + _configuration["StoredFilesPath"] +"\n";
            config += "User Thumbnail Path: " + _configuration["StoredThumbs"] +"\n";
        }
        
        _logger.LogInformation(config);
        
    }
}