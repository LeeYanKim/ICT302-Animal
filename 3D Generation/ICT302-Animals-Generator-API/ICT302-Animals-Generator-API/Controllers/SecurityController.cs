using System.Text.Json;
using System.Text.Json.Nodes;
using ICT302_Animals_Generator_API.Util;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace ICT302_Animals_Generator_API.Controllers;

[Route("/")]
public class SecurityController : ControllerBase
{
    private readonly ILogger<SecurityController> _logger;
    private readonly IConfiguration _configuration;
    private readonly SecurityMaster _securityMaster;
    
    public SecurityController(ILogger<SecurityController> logger, IConfiguration configuration, SecurityMaster securityMaster)
    {
        _logger = logger;
        _configuration = configuration;
        _securityMaster = securityMaster;
    }

    [HttpGet("/")]
    [HttpGet("alive")]
    public ActionResult Index()
    {
        return StatusCode(StatusCodes.Status418ImATeapot);
    }
    
    /**
     *<summary>Catch-all or alive check if this application is responding</summary>
     *
     * <param name="model">Object information from request. Only auth token expected</param>
     *
     * <returns>Http Action Result 200 Ok if token is valid, 418 I'm a TeaPot if not.</returns>
     */
    [HttpPost("*/*")]
    [HttpPost("alive")]
    public ActionResult Alive([FromForm] StartGenerationModel? model)
    {
        if (model == null)
            return StatusCode(StatusCodes.Status418ImATeapot); //Connection isnt authorized, Im a Teapot

        model.StartGenerationJson = StartGenerationJsonConverter.GetFromJson(HttpContext.Request.Form);
        
        if(model.StartGenerationJson == null || string.IsNullOrEmpty(model.StartGenerationJson.Token))
            return StatusCode(StatusCodes.Status418ImATeapot); //Connection isnt authorized, Im a Teapot

        return StatusCode(_securityMaster.IsRequestAuthorized(model.StartGenerationJson.Token));//Only return the status code
    }
    

}