// FileUploadController.cs

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.IO;
using ICT302_BackendAPI.Database.Repositories;
using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.API.APIs;

[Route("api/upload")]
[ApiController]
public class FileUploadController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<FileUploadController> _logger;
    private readonly ISchemaRepository _schemaRepository;
    private readonly List<AllowedFileTypes> _allowedFileTypes;

    public FileUploadController(IConfiguration configuration, ILogger<FileUploadController> logger, ISchemaRepository schemaRepository)
    {
        _configuration = configuration;
        _logger = logger;
        _schemaRepository = schemaRepository;
        _allowedFileTypes = GetAllowedFileTypes();
    }

    private struct AllowedFileTypes
    {
        public string FileType { get; set; }
        public string FileExtension { get; set; }

        public AllowedFileTypes(string type, string extension)
        {
            FileType = type;
            FileExtension = extension;
        }
    }

    private List<AllowedFileTypes> GetAllowedFileTypes()
    {
        var types = new List<AllowedFileTypes>();
        var allowedFileTypes = _configuration.GetSection("AllowedFileUploadTypes");
        foreach (var fileType in allowedFileTypes.GetChildren())
        {
            types.Add(new AllowedFileTypes(fileType.Key, fileType.Value!));
        }

        return types;
    }

    private bool isFileTypeAllowed(string uploadedFileType)
    {
        foreach (var fileType in _allowedFileTypes)
        {
            if (fileType.FileType == uploadedFileType)
                return true;
        }

        return false;
    }

    [HttpPost]
    public async Task<IActionResult> UploadFileAsync(List<IFormFile> files, [FromForm] string animalName, [FromForm] string animalType, [FromForm] DateTime animalDOB)
    {
        _logger.LogInformation("Received file upload request: AnimalName = {AnimalName}, AnimalType = {AnimalType}, AnimalDOB = {AnimalDOB}, FilesCount = {FilesCount}", animalName, animalType, animalDOB, files?.Count);

        if (files == null || files.Count == 0 || string.IsNullOrEmpty(animalName) || string.IsNullOrEmpty(animalType) || animalDOB == DateTime.MinValue)
        {
            _logger.LogWarning("Invalid request: No files or missing animal details.");
            return BadRequest(new { message = "Invalid file(s) or missing animal details." });
        }

        long size = files.Sum(f => f.Length);
        int totalUploadedFiles = 0;
        string filePath = "";
        string storedFilesPath = RuntimeInformation.IsOSPlatform(OSPlatform.Linux)
            ? _configuration["StoredFilesPath_Linux"]
            : _configuration["StoredFilesPath"];

        if (!Directory.Exists(storedFilesPath))
        {
            _logger.LogInformation("Stored files directory does not exist. Creating directory: {StoredFilesPath}", storedFilesPath);
            try
            {
                Directory.CreateDirectory(storedFilesPath);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogError(ex, "Permission denied while trying to create stored files directory: {StoredFilesPath}", storedFilesPath);
                return StatusCode(500, new { message = "Internal server error: Unable to create directory." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating directory: {StoredFilesPath}", storedFilesPath);
                return StatusCode(500, new { message = "Internal server error: Unable to create directory." });
            }
        }

        foreach (var formFile in files)
        {
            if (formFile.Length > 0)
            {
                _logger.LogInformation("Processing file: {FileName}, ContentType: {ContentType}, Length: {Length}", formFile.FileName, formFile.ContentType, formFile.Length);

                if (isFileTypeAllowed(formFile.ContentType))
                {
                    filePath = Path.Combine(storedFilesPath, formFile.FileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        _logger.LogWarning("File already exists: {FilePath}", filePath);
                        return Conflict(new { message = $"File '{formFile.FileName}' already exists. Upload rejected." });
                    }

                    _logger.LogInformation("Uploaded file: {FileName} is allowed", formFile.FileName);
                    totalUploadedFiles++;

                    try
                    {
                        await using (var stream = System.IO.File.Create(filePath))
                        {
                            await formFile.CopyToAsync(stream);
                            _logger.LogInformation("File successfully saved at: {FilePath}", filePath);

                            bool thumbnailGenerated = await GenerateThumbnailAsync(filePath, formFile.FileName);
                            byte[]? thumbnailData = null;

                            if (thumbnailGenerated)
                            {
                                string thumbnailPath = Path.Combine(storedFilesPath, "thumbnails", $"{Path.GetFileNameWithoutExtension(formFile.FileName)}.jpg");
                                if (System.IO.File.Exists(thumbnailPath))
                                {
                                    thumbnailData = await System.IO.File.ReadAllBytesAsync(thumbnailPath);
                                }
                                else
                                {
                                    _logger.LogWarning("Thumbnail file not found at expected path: {ThumbnailPath}", thumbnailPath);
                                }
                            }

                            // Add entry to the database
                            var animal = new Animal
                            {
                                AnimalID = Guid.NewGuid(),
                                AnimalName = animalName,
                                AnimalType = animalType,
                                AnimalDOB = animalDOB,
                                VideoUploadDate = DateTime.Now,
                                //ThumbnailData = thumbnailData
                            };

                            _logger.LogInformation("Creating animal entry in the database: AnimalName = {AnimalName}", animal.AnimalName);
                            await _schemaRepository.CreateAnimalAsync(animal);
                        }
                    }
                    catch (UnauthorizedAccessException ex)
                    {
                        _logger.LogError(ex, "Permission denied while saving the file: {FilePath}", filePath);
                        return StatusCode(500, new { message = "Permission denied: Unable to save the file." });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error occurred while saving the file: {FilePath}", filePath);
                        return StatusCode(500, new { message = "Internal server error: Unable to save the file." });
                    }
                }
                else
                {
                    _logger.LogWarning("Uploaded file: {FileName} is not allowed", formFile.FileName);
                    continue;
                }
            }
        }

        if (totalUploadedFiles > 0)
        {
            _logger.LogInformation("Total uploaded files: {TotalUploadedFiles}, Total size: {Size}", totalUploadedFiles, size);
            return Ok(new { count = totalUploadedFiles, size });
        }

        _logger.LogWarning("No files uploaded due to unsupported file types");
        return BadRequest(new { message = "No files uploaded due to unsupported file types" });
    }

    // This method should be defined within the FileUploadController class to avoid CS0103 error.
    private async Task<bool> GenerateThumbnailAsync(string videoFilePath, string fileName)
    {
        string thumbnailDir = RuntimeInformation.IsOSPlatform(OSPlatform.Linux)
            ? Path.Combine(_configuration["StoredFilesPath_Linux"]!, "thumbnails")
            : Path.Combine(_configuration["StoredFilesPath"]!, "thumbnails");

        if (!Directory.Exists(thumbnailDir))
        {
            _logger.LogInformation("Thumbnail directory does not exist. Creating directory: {ThumbnailDir}", thumbnailDir);
            Directory.CreateDirectory(thumbnailDir);
        }

        var thumbnailPath = Path.Combine(thumbnailDir, $"{Path.GetFileNameWithoutExtension(fileName)}.jpg");
        _logger.LogInformation("Generating thumbnail at path: {ThumbnailPath}", thumbnailPath);

        var ffmpeg = new ProcessStartInfo
        {
            FileName = "ffmpeg",
            Arguments = $"-i \"{videoFilePath}\" -ss 00:00:01.000 -vframes 1 \"{thumbnailPath}\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        try
        {
            using (var process = Process.Start(ffmpeg))
            {
                if (process == null)
                {
                    _logger.LogError("Failed to start FFmpeg process.");
                    return false;
                }

                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                _logger.LogInformation("FFmpeg output: {Output}", output);
                if (!string.IsNullOrEmpty(error))
                {
                    _logger.LogError("FFmpeg error: {Error}", error);
                    return false;
                }

                // Check if the thumbnail file was created successfully
                if (!System.IO.File.Exists(thumbnailPath))
                {
                    _logger.LogError("Thumbnail file was not created successfully at path: {ThumbnailPath}", thumbnailPath);
                    return false;
                }

                return true;
            }
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Permission denied while accessing the file: {VideoFilePath}", videoFilePath);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while generating thumbnail.");
            return false;
        }
    }
}
