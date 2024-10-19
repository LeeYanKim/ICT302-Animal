using ICT302_Animals_Generator_API.Util;
using Microsoft.AspNetCore.Mvc;

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
    
    /**
     *<summary>Catch-all or alive check if this application is responding</summary>
     *
     * <param name="model">Object information from request. Only auth token expected</param>
     *
     * <returns>Http Action Result 200 Ok if token is valid, 418 I'm a TeaPot if not.</returns>
     */
    [HttpGet("*/*")]
    [HttpGet("alive")]
    public ActionResult Alive(StartGenerationModel? model)
    {
        if (model == null)
            return StatusCode(StatusCodes.Status418ImATeapot); //Connection isnt authorized, Im a Teapot
        
        if(model.StartGenerationJson.Token == null)
            return StatusCode(StatusCodes.Status418ImATeapot); //Connection isnt authorized, Im a Teapot

        return StatusCode(_securityMaster.IsRequestAuthorized(model.StartGenerationJson.Token));//Only return the status code
    }


}