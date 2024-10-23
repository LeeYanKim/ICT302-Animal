using System.Text.Json.Nodes;
using ICT302_Animals_Generator_API.Util;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace ICT302_Animals_Generator_API.Controllers;

public class GenFileController(ILogger<GenerationController> logger, IConfiguration configuration, SecurityMaster securityMaster)
    : ControllerBase
{
    private readonly ILogger<GenerationController> _logger = logger;
    private readonly IConfiguration _configuration = configuration;
    private readonly SecurityMaster _securityMaster = securityMaster;

    [HttpPost("/api/gen/files")]
    public ActionResult GetGeneratedFileAsync([FromForm] StartGenerationModel? model)
    {
        try
        {
            if(model == null)
                return StatusCode(500, new { message = "Internal server error while fetching file." });

            model.StartGenerationJson = GetFromJson();
            
            if (string.IsNullOrEmpty(model.StartGenerationJson.Token) ||
                _securityMaster.IsRequestAuthorized(model.StartGenerationJson.Token) == StatusCodes.Status418ImATeapot)
            {
                return StatusCode(401, new { message = "Unauthorized" });
            }

            var jobFolder = "job_" + model.StartGenerationJson.JobID;

            var jobFile = model.StartGenerationJson.JobID + ".glb";

            var outputRoot = _configuration.GetValue<string>("OutputRootFolder");
            var userHome = _configuration.GetValue<string>("LinuxHomeUserPath");
            var outPath = Path.Join(userHome, outputRoot, jobFolder, jobFile);


            if (System.IO.File.Exists(outPath))
            {
                _logger.LogInformation("Requested file found: {FilePath}", outPath);
                var mimeType = GetMimeType(outPath);
                var fileStream = new FileStream(outPath, FileMode.Open, FileAccess.Read);
                return File(fileStream, mimeType, enableRangeProcessing: true);
            }
            else
            {
                _logger.LogWarning("Requested file not found: {FilePath}", outPath);
                return NotFound(new { message = "File not found." });
            }
            
            
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while serving file: {FileName}", model!.StartGenerationJson!.FileName);
            return StatusCode(500, new { message = "Internal server error while fetching file." });
        }
        
    }
    
    private StartGenerationJson GetFromJson()
    {
        StringValues data;
        HttpContext.Request.Form.TryGetValue("StartGenerationJson", out data);
        var j = JsonNode.Parse(data!);
        var jj = StartGenerationJsonConverter.FromJson(j);
        return jj;
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
            ".glb" => "model/gltf-binary",
            _ => "application/octet-stream",
        };
    }
}