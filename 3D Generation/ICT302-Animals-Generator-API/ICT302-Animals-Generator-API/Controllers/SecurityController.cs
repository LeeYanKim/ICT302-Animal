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

        model.StartGenerationJson = GetFromJson();
        
        if(model.StartGenerationJson == null || string.IsNullOrEmpty(model.StartGenerationJson.Token))
            return StatusCode(StatusCodes.Status418ImATeapot); //Connection isnt authorized, Im a Teapot

        return StatusCode(_securityMaster.IsRequestAuthorized(model.StartGenerationJson.Token));//Only return the status code
    }

    private StartGenerationJson? GetFromJson()
    {
        try
        {
            StringValues data;
            if (HttpContext.Request.Form.TryGetValue("StartGenerationJson", out data))
            {
                switch (data.Count)
                {
                    case 0:
                        return null;
                    case 1:
                        var a = new StartGenerationJson
                        {
                            Token = data[0]
                        };
                        return a;
                    case 2:
                        var b = new StartGenerationJson
                        {
                            Token = data[0],
                            JobID = Guid.Parse(data[1])
                        };
                        return b;
                    case 3:
                        var j = JsonNode.Parse(data);
                        var jj = StartGenerationJsonConverter.FromJson(j);
                        return jj;
                    default:
                        return null;
                }
                
                return null;
            }
            
            if (HttpContext.Request.Form.TryGetValue("StartGenerationJson.Token", out data))
            {
                switch (data.Count)
                {
                    case 1:
                        var a = new StartGenerationJson
                        {
                            Token = data[0]
                        };
                        return a;
                    default:
                        return null;
                }
            }

            return null;
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            return null;
        }
    }

}