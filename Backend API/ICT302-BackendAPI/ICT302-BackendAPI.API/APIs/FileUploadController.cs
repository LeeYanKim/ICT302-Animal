// API/Controllers/FileUploadController.cs
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Globalization;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace ICT302_BackendAPI.API.Controllers
{
    [Route("api/upload")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<FileUploadController> _logger;
        private readonly ISchemaRepository _schemaRepository;

        public FileUploadController(IConfiguration configuration, ILogger<FileUploadController> logger, ISchemaRepository schemaRepository)
        {
            _configuration = configuration;
            _logger = logger;
            _schemaRepository = schemaRepository;
        }

       [HttpPost]
public async Task<IActionResult> UploadFileAsync(IFormFile file, [FromForm] string animalName, [FromForm] string animalType, [FromForm] string dateOfBirth)
{
    try
    {
        _logger.LogInformation("Received file upload request: AnimalName = {AnimalName}, AnimalType = {AnimalType}, DateOfBirth = {DateOfBirth}", animalName, animalType, dateOfBirth);

        // Validate input fields
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("Invalid request: No file provided.");
            return BadRequest(new { message = "Invalid file or missing animal details." });
        }

        if (string.IsNullOrEmpty(animalName) || string.IsNullOrEmpty(animalType) || string.IsNullOrEmpty(dateOfBirth))
        {
            _logger.LogWarning("Missing animal details. AnimalName: {AnimalName}, AnimalType: {AnimalType}, DateOfBirth: {DateOfBirth}", animalName, animalType, dateOfBirth);
            return BadRequest(new { message = "Invalid file or missing animal details." });
        }

        if (!DateTime.TryParseExact(dateOfBirth, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedAnimalDOB))
        {
            _logger.LogWarning("Invalid date of birth format: {0}", dateOfBirth);
            return BadRequest(new { message = "Invalid date of birth format." });
        }

        // Determine stored file path
        /*for development, it doesnt matter (?) the os platform as the vm storing the data is windows, this check was just for development in my (David) local env
        string storedFilesPath = RuntimeInformation.IsOSPlatform(OSPlatform.Linux)
            ? _configuration["StoredFilesPath_Linux"]
            : _configuration["StoredFilesPath"];

        */

        //there should be just one path.
        string storedFilesPath = _configuration["StoredFilesPath"];

        if (string.IsNullOrEmpty(storedFilesPath))
        {
            _logger.LogError("StoredFilesPath is not configured.");
            return StatusCode(500, new { message = "Configuration error: StoredFilesPath is not defined." });
        }

        // Ensure directory exists
        if (!Directory.Exists(storedFilesPath))
        {
            _logger.LogInformation("Stored files directory does not exist. Creating directory: {StoredFilesPath}", storedFilesPath);
            Directory.CreateDirectory(storedFilesPath);
        }

        // Validate file type
        string fileExtension = Path.GetExtension(file.FileName);
        if (!IsFileTypeAllowed(fileExtension))
        {
            _logger.LogWarning("Uploaded file: {FileName} is not an allowed type", file.FileName);
            return BadRequest(new { message = "Unsupported file type." });
        }

        //Sanitize and generate a unique file name
        string sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName);
        sanitizedFileName = string.Join("_", sanitizedFileName.Split(Path.GetInvalidFileNameChars()));
        string uniqueFileName = $"{sanitizedFileName}_{Guid.NewGuid()}{fileExtension}";
        string filePath = Path.Combine(storedFilesPath, uniqueFileName);

        // Save the file to disk
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }
        _logger.LogInformation("File successfully saved at: {FilePath}", filePath);

        // Add entry to the database
        var animal = new Animal
        {
            AnimalID = Guid.NewGuid(),
            AnimalName = animalName,
            AnimalType = animalType,
            AnimalDOB = parsedAnimalDOB,
            VideoUploadDate = DateTime.Now,
            VideoFileName = uniqueFileName
        };

        _logger.LogInformation("Creating animal entry in the database: AnimalName = {AnimalName}", animal.AnimalName);
        await _schemaRepository.CreateAnimalAsync(animal);
        _logger.LogInformation("Animal entry created in the database with ID: {AnimalID}", animal.AnimalID);

        return Ok(new { message = "File uploaded and animal data saved successfully." });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "An unexpected error occurred during file upload.");
        return StatusCode(500, new { message = "Internal server error during file upload." });
    }
}


        private bool IsFileTypeAllowed(string fileExtension)
        {
            var allowedExtensions = _configuration.GetSection("AllowedFileUploadTypes").Get<string[]>();
            return allowedExtensions.Contains(fileExtension.ToLowerInvariant());
        }
    }
}
