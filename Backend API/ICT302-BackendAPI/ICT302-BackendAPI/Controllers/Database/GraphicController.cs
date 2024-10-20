// GraphicController.cs
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.IO;

namespace ICT302_BackendAPI.Controllers.Database
{
    [Route("api/db")]
    [ApiController]
    public class GraphicController : ControllerBase
    {
        private readonly IGraphicRepository _graphicRepo;
        private readonly ILogger<GraphicController> _logger;
        private readonly IAnimalRepository _animalRepo;

        public GraphicController(IGraphicRepository graphicRepo, ILogger<GraphicController> logger, IAnimalRepository animalRepo)
        {
            _graphicRepo = graphicRepo;
            _logger = logger;
            _animalRepo = animalRepo;
        }

        [HttpPost("graphic")]
        public async Task<ActionResult> AddGraphicAsync([FromBody] Graphic graphic)
        {
            try
            {
                graphic.GPCID = Guid.NewGuid();
                graphic.Animal = await _animalRepo.GetAnimalByIDAsync(graphic.AnimalID) ?? new Animal();
                var g = await _graphicRepo.CreateGraphicAsync(graphic);
                return Ok(g);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding graphic.");
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
                _logger.LogError(ex, "Error retrieving graphics.");
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
                _logger.LogError(ex, "Error retrieving graphic.");
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
                _logger.LogError(ex, "Error deleting graphic.");
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
                existingGraphic.GPCSize = graphicToUpdate.GPCSize;

                await _graphicRepo.UpdateGraphicAsync(existingGraphic);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating graphic.");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }
    // Endpoint to get a video by GPCID
        [HttpGet("graphics/videos/{gpcID}")]
        public async Task<IActionResult> GetVideo(Guid gpcID)
        {
            try
            {
                var graphic = await _graphicRepo.GetGraphicByIDAsync(gpcID);
                if (graphic == null)
                {
                    return NotFound(new { message = "Video not found" });
                }

                var videoPath = graphic.FilePath;
                if (!System.IO.File.Exists(videoPath))
                {
                    return NotFound(new { message = "Video file not found on server." });
                }

                var videoStream = new FileStream(videoPath, FileMode.Open, FileAccess.Read);
                string mimeType = GetMimeType(videoPath);
                return File(videoStream, mimeType, enableRangeProcessing: true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving video.");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }

        private string GetMimeType(string filePath)
        {
            string extension = Path.GetExtension(filePath).ToLowerInvariant();
            return extension switch
            {
                ".mp4" => "video/mp4",
                ".mov" => "video/quicktime",
                ".webm" => "video/webm",
                ".mkv" => "video/x-matroska",
                _ => "application/octet-stream",
            };
        }

    }
}