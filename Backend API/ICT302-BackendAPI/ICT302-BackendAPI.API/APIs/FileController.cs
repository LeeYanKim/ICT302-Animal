using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;

namespace ICT302_BackendAPI.API.APIs;

// Controller for getting files from the backend
[Route("api/user/files")]
[ApiController]
public class FileController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<FileController> _logger;
    
    public FileController(IConfiguration configuration, ILogger<FileController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("{fileName}")]
    public async Task<FileStreamResult> GetUserFileAsync(string fileName)
    {
        // TODO: Get user context and get file from storage 
        //Console.WriteLine("{0}, {1}", fileName, HttpUtility.UrlDecode(contentType));


        string contentType;
        var filePath = Path.Combine(_configuration["dev_StoredFilesPath"]!, fileName);
        new FileExtensionContentTypeProvider().TryGetContentType(filePath, out contentType);
        var stream = new FileStream(filePath, FileMode.Open);
        return new FileStreamResult(stream, contentType);
        

    }
}