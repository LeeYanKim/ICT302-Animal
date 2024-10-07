using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Runtime.InteropServices;
using ICT302_BackendAPI.Database.Repositories;
using ICT302_BackendAPI.Database.Models;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.StaticFiles;

namespace ICT302_BackendAPI.API.APIs;

// Controller for getting files from the backend
[ApiController]
[Route("api/files")]
public class FileController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<FileController> _logger;
    private readonly ISchemaRepository _schemaRepository;

    public FileController(IConfiguration configuration, ILogger<FileController> logger, ISchemaRepository schemaRepository)
    {
        _configuration = configuration;
        _logger = logger;
        _schemaRepository = schemaRepository;
    }

    [HttpGet("{fileName}")]
    public async Task<IActionResult> GetUserFileAsync(string fileName)
    {
        string contentType;
        var filePath = Path.Combine(_configuration["dev_StoredFilesPath"]!, fileName);

        if (!System.IO.File.Exists(filePath))
        {
            _logger.LogWarning("File not found: {0}", fileName);
            return NotFound(new { message = "File not found." });
        }

        if (!new FileExtensionContentTypeProvider().TryGetContentType(filePath, out contentType))
        {
            contentType = "application/octet-stream";
        }

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true);
        return new FileStreamResult(stream, contentType);
    }

    [HttpGet("videos/list")]
    public IActionResult GetVideoList()
    {
        string videoDirectory;

        _logger.LogInformation("Retrieving video list");

        // Retrieve the allowed file extensions from the config
        var allowedFileTypes = _configuration.GetSection("AllowedFileUploadTypes")
                                             .GetChildren()
                                             .Select(x => x.Value)
                                             .ToList();

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            videoDirectory = Path.Combine(_configuration["dev_StoredFilesPath_Linux"]!);
        }
        else
        {
            videoDirectory = Path.Combine(_configuration["dev_StoredFilesPath"]!);
        }

        if (!Directory.Exists(videoDirectory))
        {
            _logger.LogWarning("Video directory not found: {0}", videoDirectory);
            return NotFound(new { message = "Video directory not found." });
        }

        var videoFiles = Directory.GetFiles(videoDirectory)
                                  .Where(f => allowedFileTypes.Any(ext => f.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
                                  .Select(Path.GetFileName)
                                  .ToList();

        _logger.LogInformation("Returning video files: {@videoFiles}", videoFiles);
        return Ok(videoFiles);
    }

   [HttpGet("animals/list")]
public async Task<IActionResult> GetUploadedAnimalsAsync()
{
    _logger.LogInformation("Retrieving uploaded animals list");

    try
    {
        var animals = await _schemaRepository.GetAnimalsAsync();

        var animalDataList = animals.Select(animal => new
        {
            animal.AnimalID,
            animal.AnimalName,
            animal.AnimalType,
            animal.VideoUploadDate
        }).ToList();

        return Ok(animalDataList);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error occurred while retrieving uploaded animals list");
        return StatusCode(500, new { message = "Internal server error." });
    }
}

}