// FileUploadController.cs
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace ICT302_BackendAPI.API.Controllers
{
    [Route("api/upload")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<FileUploadController> _logger;
        private readonly ISchemaRepository _schemaRepository;
        private readonly IGraphicRepository _graphicRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileUploadController(
            IConfiguration configuration,
            ILogger<FileUploadController> logger,
            ISchemaRepository schemaRepository,
            IGraphicRepository graphicRepository,
            IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            _logger = logger;
            _schemaRepository = schemaRepository;
            _graphicRepository = graphicRepository;
            _webHostEnvironment = webHostEnvironment;
        }

       [HttpPost]
public async Task<IActionResult> UploadFilesAsync(
    [FromForm] IFormFileCollection files,
    [FromForm] string animalName,
    [FromForm] string animalType,
    [FromForm] string dateOfBirth)
{
    try
    {
        // Validation logic...

        string storedFilesPath = _webHostEnvironment.IsDevelopment()
            ? _configuration["dev_StoredFilesPath"]
            : _configuration["StoredFilesPath"];

        // Ensure directory exists
        if (!Directory.Exists(storedFilesPath))
        {
            Directory.CreateDirectory(storedFilesPath);
        }

        var animal = await _schemaRepository.GetAnimalByNameAndDOBAsync(animalName, DateTime.Parse(dateOfBirth))
            ?? await _schemaRepository.CreateAnimalAsync(new Animal
            {
                AnimalID = Guid.NewGuid(),
                AnimalName = animalName,
                AnimalType = animalType,
                AnimalDOB = DateTime.Parse(dateOfBirth)
            });

        foreach (var file in files)
        {
            string fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            string filePath = Path.Combine(storedFilesPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var graphic = new Graphic
            {
                GPCID = Guid.NewGuid(),
                GPCName = Path.GetFileNameWithoutExtension(file.FileName),
                FilePath = fileName,  // Only store the filename, not the full path
                AnimalID = animal.AnimalID,
                GPCDateUpload = DateTime.Now,
                GPCSize = (int)file.Length
            };

            await _graphicRepository.CreateGraphicAsync(graphic);
        }

        return Ok(new { message = "Files uploaded and data saved successfully." });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during file upload.");
        return StatusCode(500, new { message = "Internal server error during file upload." });
    }
}

        private bool IsFileTypeAllowed(string fileExtension)
        {
            var allowedExtensions = _configuration.GetSection("AllowedFileUploadTypes").Get<string[]>();
            return allowedExtensions.Contains(fileExtension.ToLowerInvariant());
        }

        private string SanitizeFileName(string fileName)
        {
            // Remove any character that is not a letter, digit, underscore, or dash
            return Regex.Replace(fileName, "[^a-zA-Z0-9_-]", "");
        }
    }
}