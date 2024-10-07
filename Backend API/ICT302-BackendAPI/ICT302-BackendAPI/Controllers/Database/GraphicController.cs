using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Controllers.Database
{
    [Route("api/db")]
    [ApiController]
    public class GraphicController : ControllerBase
    {
        private readonly IGraphicRepository _graphicRepo;
        private readonly ILogger<GraphicController> _logger;

        public GraphicController(IGraphicRepository graphicRepo, ILogger<GraphicController> logger)
        {
            _graphicRepo = graphicRepo;
            _logger = logger;
        }

        [HttpPost("graphic")]
        public async Task<ActionResult> AddGraphicAsync([FromBody] Graphic graphic)
        {
            try
            {
                graphic.GPCID = Guid.NewGuid();
                return Ok(await _graphicRepo.CreateGraphicAsync(graphic));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }

        [HttpGet("graphics")]
        public async Task<ActionResult> GetGraphicsAsync()
        {
            try
            {
                var graphics = await _graphicRepo.GetGraphicsAsync();
                return Ok(graphics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }

        [HttpGet("graphic/{id}")]
        public async Task<IActionResult> GetGraphicByID(Guid id)
        {
            try
            {
                var graphic = await _graphicRepo.GetGraphicByIDAsync(id);
                if (graphic == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(graphic);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }

        [HttpDelete("graphic/{id}")]
        public async Task<IActionResult> DeleteGraphic(Guid id)
        {
            try
            {
                var existingGraphic = await _graphicRepo.GetGraphicByIDAsync(id);
                if (existingGraphic == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _graphicRepo.DeleteGraphicAsync(existingGraphic);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }

        [HttpPut("graphic")]
        public async Task<IActionResult> UpdateGraphic([FromBody] Graphic graphicToUpdate)
        {
            try
            {
                var existingGraphic = await _graphicRepo.GetGraphicByIDAsync(graphicToUpdate.GPCID);
                if (existingGraphic == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingGraphic.GPCName = graphicToUpdate.GPCName;
                existingGraphic.GPCDateUpload = graphicToUpdate.GPCDateUpload;
                existingGraphic.FilePath = graphicToUpdate.FilePath;
                existingGraphic.AnimalID = graphicToUpdate.AnimalID;
                existingGraphic.BillingID = graphicToUpdate.BillingID;
                existingGraphic.GPCSize = graphicToUpdate.GPCSize;

                await _graphicRepo.UpdateGraphicAsync(existingGraphic);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }
    }
}
