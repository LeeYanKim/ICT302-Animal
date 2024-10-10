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
        _logger.LogInformation("App Environment: " + _environment.EnvironmentName);

        if (_environment.IsDevelopment())
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                _logger.LogInformation("User Storage Path: " + _configuration["dev_StoredFilesPath_Linux"]);
                _logger.LogInformation("User Thumbnail Path: " + _configuration["dev_StoredThumbs_Linux"]);
            }
            else
            {
                _logger.LogInformation("User Storage Path: " + _configuration["dev_StoredFilesPath"]);
                _logger.LogInformation("User Thumbnail Path: " + _configuration["dev_StoredThumbs"]);
            }
            
        }
        else
        {
            _logger.LogInformation("User Storage Path: " + _configuration["StoredFilesPath"]);
            _logger.LogInformation("User Thumbnail Path: " + _configuration["StoredThumbs"]);
        }
        
    }
}