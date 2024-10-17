using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Runtime.InteropServices;
using ICT302_BackendAPI.Database.Repositories;
using System.Threading.Tasks;
using ICT302_BackendAPI.Database.Models;
using System;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;

namespace ICT302_BackendAPI.API.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<FilesController> _logger;
        private readonly IAnimalRepository _animalRepository;

        public FilesController(IConfiguration configuration, ILogger<FilesController> logger, IAnimalRepository animalRepository, IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            _logger = logger;
            _animalRepository = animalRepository;
            _webHostEnvironment = webHostEnvironment;
        }

     [HttpGet("animals/details/{id}")]
public async Task<IActionResult> GetAnimalDetails(Guid id)
{
    try
    {
        var animal = await _schemaRepository.GetAnimalByIDAsync(id);
        if (animal == null)
        {
            return NotFound(new { message = "Animal not found" });
        }

        // Construct video URLs dynamically based on the filename
        foreach (var graphic in animal.Graphics)
        {
            graphic.FilePath = $"{Request.Scheme}://{Request.Host}/api/files/animals/videos/{graphic.FilePath}";
        }

        return Ok(animal);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving animal details.");
        return StatusCode(500, new { message = "Internal server error" });
    }
}



[HttpGet("animals/videos/{fileName}")]
public IActionResult GetAnimalVideo(string fileName)
{
    try
    {
        string storedFilesPath = _webHostEnvironment.IsDevelopment()
            ? _configuration["dev_StoredFilesPath"]
            : _configuration["StoredFilesPath"];

        var filePath = Path.Combine(storedFilesPath, fileName);

        if (!System.IO.File.Exists(filePath))
        {
            _logger.LogWarning("Requested video file not found: {FilePath}", filePath);
            return NotFound(new { message = "Video file not found." });
        }

        var mimeType = GetMimeType(filePath);
        var videoStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        return File(videoStream, mimeType, enableRangeProcessing: true);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error occurred while serving video file: {FileName}", fileName);
        return StatusCode(500, new { message = "Internal server error while fetching video." });
    }
}

        // Endpoint to get the list of animals
        [HttpGet("animals/list")]
        public async Task<IActionResult> GetAnimalsListAsync()
        {
            try
            {
                var animals = await _animalRepository.GetAnimalsAsync();

                if (animals == null || !animals.Any())
                {
                    return NotFound(new { message = "No animals found" });
                }

                return Ok(animals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching the list of animals");
                return StatusCode(500, new { message = "Internal server error while fetching animals list." });
            }
        }

        // Updated endpoint to get animal details by ID
        [HttpGet("animals/details/{animalID}")]
        public async Task<IActionResult> GetAnimalByIdAsync(Guid animalID)
        {
            try
            {
                var animal = await _animalRepository.GetAnimalByIDAsync(animalID);

                if (animal == null)
                {
                    return NotFound(new { message = "Animal not found" });
                }

                return Ok(animal);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching animal data: {AnimalID}", animalID);
                return StatusCode(500, new { message = "Internal server error while fetching animal data." });
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
}