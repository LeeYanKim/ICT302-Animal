using System.Runtime.InteropServices;

namespace ICT302_BackendAPI.Utility;

public class Utility(IConfiguration configuration, ILogger logger, IWebHostEnvironment environment)
{
    public void PrintStartingConfig()
    {
        string config = "Starting with configuration:\n";
        config += "\tApp Environment: " + environment.EnvironmentName +"\n";

        if (environment.IsDevelopment())
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                config += "\tUser Storage Path: " + configuration["dev_StoredFilesPath_Linux"] +"\n";
                config += "\tUser Thumbnail Path: " + configuration["dev_StoredThumbs_Linux"] +"\n";
            }
            else
            {
                config += "\tUser Storage Path: " + configuration["dev_StoredFilesPath"] +"\n";
                config += "\tUser Thumbnail Path: " + configuration["dev_StoredThumbs"] +"\n";
            }
            
        }
        else
        {
            config += "\tUser Storage Path: " + configuration["StoredFilesPath"] +"\n";
            config += "\tUser Thumbnail Path: " + configuration["StoredThumbs"] +"\n";
        }
        
        config += "\tLogging file: " + configuration.GetValue<string>("Logging:File:Path") +"\n";
        config += "\tSwagger Enabled: " + configuration.GetValue<bool>("EnableSwagger") +"\n";
        config += "\tGenAPI URL: " + configuration.GetValue<string>("GenAPIUrl") +"\n";
        
        logger.LogInformation(config);
        
    }
}