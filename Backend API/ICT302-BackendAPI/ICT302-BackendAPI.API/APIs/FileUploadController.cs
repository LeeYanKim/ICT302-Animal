using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ICT302_BackendAPI.API.APIs;

[Route("api/upload")]
[ApiController]
public class FileUploadController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<FileUploadController> _logger;
    private readonly List<AllowedFileTypes> _allowedFileTypes;
    
    public FileUploadController(IConfiguration configuration, ILogger<FileUploadController> logger)
    {
        _configuration = configuration;
        _logger = logger;
        _allowedFileTypes = GetAllowedFileTypes();
    }

    // Structure of a allowed file type
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

    // Gets allowed file types from the config settings of the application
    private List<AllowedFileTypes> GetAllowedFileTypes()
    {
        var types = new List<AllowedFileTypes>();
        var allowedFileTypes = _configuration.GetSection("AllowedFileUploadTypes");
        foreach (var fileType in allowedFileTypes.GetChildren())
        {
            //Console.WriteLine("Key: {0}  Value: {1}", fileType.Key, fileType.Value);
            types.Add(new AllowedFileTypes(fileType.Key, fileType.Value!));
        }

        return types;
    }

    private bool isFileTypeAllowed(string uploadedFileType)
    {
        foreach (var fileType in _allowedFileTypes)
        {
            if(fileType.FileType == uploadedFileType)
                return true;
        }
        
        return false;
    }

    // TODO: Add other props to this post request to also get linking data to the user account that uploaded the file
    [HttpPost]
    public async Task<IActionResult> UploadFileAsync(List<IFormFile> files)
    {
        long size = files.Sum(f => f.Length);
        int totalUploadedFiles = 0;
        
        Console.WriteLine(files);
        
        foreach (var formFile in files)
        {
            if (formFile.Length > 0)
            {
                Console.WriteLine(formFile.FileName);
                if (isFileTypeAllowed(formFile.ContentType))
                {
                    var filePath = Path.Combine(_configuration["dev_StoredFilesPath"]!, formFile.FileName); // TODO: Update this to the VM upload path
                    Console.WriteLine(filePath);
                    
                    Console.WriteLine($"Uploaded file: {formFile.FileName} is allowed");
                    totalUploadedFiles++;
                    await using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                        // TODO: Add db update from here to record the upload in the db
                    }
                }
                else
                {
                    Console.WriteLine($"Uploaded file: {formFile.FileName} is not allowed");
                    continue;
                }
                

                
            }
        }

        if (totalUploadedFiles > 0)
        {
            // TODO: Process files from here and add db entry
            return Ok(new { count = totalUploadedFiles, size });
        }
        
        // No Files were uploaded
        return BadRequest(new { message = "No files uploaded due to unsupported file types" });
    }
}