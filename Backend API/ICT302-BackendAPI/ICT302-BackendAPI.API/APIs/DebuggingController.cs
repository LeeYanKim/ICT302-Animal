using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ICT302_BackendAPI.API.APIs;

[Route("api/debug")]
[ApiController]
public class DebuggingController : ControllerBase
{
    private readonly ILogger<DebuggingController> _logger;
    private readonly IWebHostEnvironment _environment;

    public DebuggingController(ILogger<DebuggingController> logger, IWebHostEnvironment environment)
    {
        _logger = logger;
        _environment = environment;
    }
    
    [HttpGet]
    public ActionResult GetDebugOk()
    {
        // Only return something if this route is called in development mode
        if(_environment.IsDevelopment())
            return Ok(new {message = "Api application is responding..."});

        return NotFound();
    }
}