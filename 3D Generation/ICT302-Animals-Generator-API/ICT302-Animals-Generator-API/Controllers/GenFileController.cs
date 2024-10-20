using ICT302_Animals_Generator_API.Util;
using Microsoft.AspNetCore.Mvc;

namespace ICT302_Animals_Generator_API.Controllers;

public class GenFileController(ILogger<GenerationController> logger, IConfiguration configuration, SecurityMaster securityMaster)
    : ControllerBase
{
    private readonly ILogger<GenerationController> _logger = logger;
    private readonly IConfiguration _configuration = configuration;
    private readonly SecurityMaster _securityMaster = securityMaster;

    [HttpGet("/api/gen/files")]
    public async Task<ActionResult> GetGeneratedFileAsync(StartGenerationModel? model)
    {
        try
        {
            if(model == null)
                return StatusCode(500, new { message = "Internal server error while fetching file." });

            if (string.IsNullOrEmpty(model.StartGenerationJson.Token) ||
                _securityMaster.IsRequestAuthorized(model.StartGenerationJson.Token) == StatusCodes.Status418ImATeapot)
            {
                return StatusCode(401, new { message = "Unauthorized" });
            }
            
            var outPath = Path.Join(_configuration.GetValue<string>("OutputPath"), "job_" + model.StartGenerationJson.JobID);
            

            if (!System.IO.File.Exists(outPath))
            {
                _logger.LogWarning("Requested file not found: {FilePath}", outPath);
                return NotFound(new { message = "File not found." });
            }

            var fileName = Path.GetFileNameWithoutExtension(model.StartGenerationJson.FileName);
            var mimeType = GetMimeType(outPath);
            var fileStream = new FileStream(outPath + "/" + fileName +".glb", FileMode.Open, FileAccess.Read);
            return File(fileStream, mimeType, enableRangeProcessing: true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while serving file: {FileName}", model.StartGenerationJson.FileName);
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