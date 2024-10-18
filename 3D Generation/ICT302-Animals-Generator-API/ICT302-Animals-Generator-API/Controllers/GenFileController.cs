using Microsoft.AspNetCore.Mvc;

namespace ICT302_Animals_Generator_API.Controllers;

public class GenFileController(ILogger<GenerationController> logger, IConfiguration configuration)
    : ControllerBase
{
    private readonly ILogger<GenerationController> _logger = logger;
    private readonly IConfiguration _configuration = configuration;

    [HttpGet("/api/gen/files")]
    public async Task<ActionResult> GetGeneratedFileAsync(string fileName)
    {
        try
        {
            var filePath = fileName;

            if (!System.IO.File.Exists(filePath))
            {
                _logger.LogWarning("Requested file not found: {FilePath}", filePath);
                return NotFound(new { message = "File not found." });
            }

            var mimeType = GetMimeType(filePath);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, mimeType, enableRangeProcessing: true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while serving file: {FileName}", fileName);
            return StatusCode(500, new { message = "Internal server error while fetching file." });
        }
        
    }
    
    private string GetMimeType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".mp4" => "video/mp4",
            ".mov" => "video/quicktime",
            ".avi" => "video/x-msvideo",
            ".mkv" => "video/x-matroska",
            _ => "application/octet-stream",
        };
    }
}