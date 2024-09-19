using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

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

    [HttpGet("{userID}/{GPCID}")]
    public async Task<FileStreamResult> GetUserFileAsync(Guid userID, Guid graphicID)
    {
        // TODO: Get user context and get file from storage 
        
        
        var filePath = Path.Combine(_configuration["dev_StoredFilesPath"]!, "ProjectLogo.png");
        var stream = new FileStream(filePath, FileMode.Open);
        return new FileStreamResult(stream, "image/png");
        

    }
}