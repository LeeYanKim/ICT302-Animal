using System.Net;

namespace ICT302_BackendAPI.Backend_API;

public class BackendEndPoints
{
    private const string ApiBaseUrl = "/api";
    
    public BackendEndPoints(WebApplication webApplication)
    {
        Console.WriteLine($"Backend API URL: {ApiBaseUrl} initialized.");
        SetupEndpoints(webApplication);
        
    }

    private void SetupEndpoints(WebApplication webApplication)
    {
        webApplication.MapGet(ApiBaseUrl + "/test", () =>
        {
            string[] test = ["test"];
            return test;
        });
    }
}