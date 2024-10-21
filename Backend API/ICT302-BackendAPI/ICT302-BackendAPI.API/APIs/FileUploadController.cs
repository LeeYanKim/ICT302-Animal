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
        private readonly IAnimalRepository _animalRepository;
        private readonly IGraphicRepository _graphicRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileUploadController(IConfiguration configuration, ILogger<FileUploadController> logger, IAnimalRepository animalRepository, IWebHostEnvironment webHostEnvironment, IGraphicRepository graphicRepository)
        {
            _configuration = configuration;
            _logger = logger;
            _animalRepository = animalRepository;
            _graphicRepository = graphicRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFileAsync(IFormFile files, [FromForm] string animalName, [FromForm] string animalType, [FromForm] string dateOfBirth, [FromForm] Guid userId)
        {
            try
            {
                _logger.LogInformation($"Received file upload request: AnimalName = {animalName}, AnimalType = {animalType}, DateOfBirth = {dateOfBirth}");

                // Validate input fields
                if (files == null || files.Length == 0)
                {
                    string msg = String.Format("Invalid request: No file provided {0} is empty", files.FileName);
                    _logger.LogWarning(msg);
                    return BadRequest(new { message = msg });
                }

                if (string.IsNullOrEmpty(animalName) || string.IsNullOrEmpty(animalType) || string.IsNullOrEmpty(dateOfBirth))
                {
                    string msg = String.Format("Invalid request: Missing animal details. AnimalName: {AnimalName}, AnimalType: {AnimalType}, DateOfBirth: {DateOfBirth}", animalName, animalType, dateOfBirth);
                    _logger.LogWarning(msg);
                    return BadRequest(new { message = msg });
                }

                if (!DateTime.TryParseExact(dateOfBirth, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedAnimalDOB))
                {
                    string msg = String.Format("Invalid date of birth format: {0}, Required format: yyyy-MM-dd", dateOfBirth);
                    _logger.LogWarning(msg, dateOfBirth);
                    return BadRequest(new { message = msg });
                }

                // Determine stored file path
                string storedFilesPath = "";
                if (_webHostEnvironment.IsDevelopment())
                {
                    // Dev environment
                    var path = RuntimeInformation.IsOSPlatform(OSPlatform.Linux)
                        ? _configuration["dev_StoredFilesPath_Linux"]
                        : _configuration["dev_StoredFilesPath"];
                    storedFilesPath = path ?? "";
                }
                else
                {
                    // Prod environment
                    storedFilesPath = _configuration["StoredFilesPath"] ?? "";
                }

                if (string.IsNullOrEmpty(storedFilesPath))
                {
                    _logger.LogError("StoredFilesPath is not configured.");
                    return StatusCode(500, new { message = "Configuration error: StoredFilesPath is not defined." });
                }

                // Ensure directory exists
                if (!Directory.Exists(storedFilesPath))
                {
                    Directory.CreateDirectory(storedFilesPath);
                }

                // Validate file type
                string fileExtension = Path.GetExtension(files.FileName);
                if (!IsFileTypeAllowed(fileExtension))
                {
                    string msg = String.Format("Uploaded file: {FileName} is of a file type that is not supported", files.FileName);
                    _logger.LogWarning(msg);
                    return BadRequest(new { message = msg });
                }

                // Sanitize and generate a unique file name
                //string sanitizedFileName = SanitizeFileName(Path.GetFileNameWithoutExtension(files.FileName));
                var gpcid = Guid.NewGuid();
                string uniqueFileName = $"{gpcid}{fileExtension}";
                string filePath = uniqueFileName; // Should be the path relative to the main upload folder

                // Add entry to the database
                var animal = new Animal
                {
                    AnimalID = Guid.NewGuid(),
                    AnimalName = animalName,
                    AnimalType = animalType,
                    AnimalDOB = parsedAnimalDOB
                };
                // Add the animal before processing upload...
                var a = await _animalRepository.CreateAnimalAsync(animal);

                int length = 0;

                if (a.AnimalID != Guid.Empty)
                {
                    // Save the file to disk
                    using (var fileStream = new FileStream(Path.Join(storedFilesPath, filePath), FileMode.Create))
                    {
                        var graphic = new Graphic
                        {
                            GPCID = gpcid,
                            AnimalID = animal.AnimalID,
                            GPCName = animal.AnimalName + "_" + animal.AnimalType,
                            GPCDateUpload = DateTime.Now,
                            FilePath = filePath,
                            GPCSize = (int)fileStream.Length,
                            Animal = animal

                        };
                        animal.Graphics.Add(graphic);
                        var g = await _graphicRepository.CreateGraphicAsync(graphic);
                        if (g.AnimalID != Guid.Empty)
                        {
                            // create the record for the graphic and then and only then process the upload incase there was a sql error
                            await _animalRepository.UpdateAnimalAsync(animal);
                            await files.CopyToAsync(fileStream);

                            // Create AnimalAccess entry
                            var access = new AnimalAccess
                            {
                                AccessID = Guid.NewGuid(),
                                AnimalID = animal.AnimalID,
                                UserID = userId,
                                AssignedDate = DateTime.Now
                            };
                        }

                    }
                }

                _logger.LogInformation($"File successfully saved at: {Path.Join(storedFilesPath, filePath)}");
                _logger.LogInformation($"Creating animal entry in the database: AnimalName = {animal.AnimalName}");
                _logger.LogInformation($"Animal entry created in the database with ID: {animal.AnimalID}");

                return Ok(new { message = "File uploaded and animal data saved successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during file upload.");
                return StatusCode(500, new { message = "Internal server error during file upload." });
            }
        }
        //to delete an animal and all associated (graphics, videos)
        [HttpDelete("animal/{animalId}")]
        public async Task<IActionResult> DeleteAnimalAsync(Guid animalId)
        {
            try
            {
                bool success = await DeleteAnimal(animalId);
                if (!success)
                {
                    return NotFound(new { message = "Animal not found." });
                }

                return Ok(new { message = "Animal and all associated data deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting the animal.");
                return StatusCode(500, new { message = "Internal server error during animal deletion." });
            }
        }



        private bool DeleteFile(string storedFilesPath, string videoFileName)
        {
            if (!string.IsNullOrEmpty(videoFileName))
            {
                string filePath = Path.Combine(storedFilesPath, videoFileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    _logger.LogInformation("File successfully deleted: {FilePath}", filePath);
                    return true;
                }
                else
                {
                    _logger.LogWarning("File not found: {FilePath}", filePath);
                }
            }
            return false;
        }
        private async Task<bool> DeleteAnimal(Guid animalId)
        {
            var animal = await _animalRepository.GetAnimalByIDAsync(animalId);
            if (animal == null)
            {
                return false; // Animal not found
            }

            // Delete all associated video files
            string storedFilesPath = GetStoredFilesPath();

            //DeleteFile(storedFilesPath, animal.VideoFileName); This needs to be looked at

            // Delete the animal record from the database
            await _animalRepository.DeleteAnimalAsync(animal);
            _logger.LogInformation("Animal and associated videos deleted successfully: {AnimalID}", animalId);

            return true;
        }


        private string GetStoredFilesPath()
        {
            string storedFilesPath = _webHostEnvironment.IsDevelopment()
                ? _configuration["dev_StoredFilesPath"]
                : _configuration["StoredFilesPath"];

            if (string.IsNullOrEmpty(storedFilesPath))
            {
                _logger.LogError("StoredFilesPath is not configured.");
                throw new InvalidOperationException("StoredFilesPath is not defined.");
            }

            return storedFilesPath;
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

        [HttpDelete("animal/{animalId}/graphic/{graphicId}")]
        public async Task<IActionResult> DeleteGraphicAsync(Guid animalId, string graphicId)
        {
            try
            {
                // Fetch the animal from the database using the animalId
                var animal = await _animalRepository.GetAnimalByIDAsync(animalId);
                if (animal == null)
                {
                    return NotFound(new { message = "Animal not found." });
                }

                // Determine the stored file path
                string storedFilesPath = GetStoredFilesPath();

                // Delete the graphic 
                bool fileDeleted = DeleteFile(storedFilesPath, graphicId);
                if (!fileDeleted)
                {
                    return NotFound(new { message = "Graphic file not found." });
                }

                // Will need to change when the structure of animal changes

                return Ok(new { message = "Graphic deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting the graphic.");
                return StatusCode(500, new { message = "Internal server error during graphic deletion." });
            }
        }


    }
}