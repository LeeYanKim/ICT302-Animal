using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ICT302_BackendAPI.Controllers.Database
{
    [Route("api/db")]
    [ApiController]
    public class Model3DController : ControllerBase
    {
        private readonly IModel3DRepository _model3DRepo;
        private readonly ILogger<Model3DController> _logger;

        public Model3DController(IModel3DRepository model3DRepo, ILogger<Model3DController> logger)
        {
            _model3DRepo = model3DRepo;
            _logger = logger;
        }

        [HttpPost("model3d")]
        public async Task<ActionResult> AddModel3DAsync([FromBody] Model3D model)
        {
            try
            {
                model.ModelID = Guid.NewGuid(); // Ensure a new GUID is generated for each model
                return Ok(await _model3DRepo.CreateModel3DAsync(model));
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

        [HttpGet("model3ds")]
        public async Task<ActionResult> GetModel3DsAsync()
        {
            try
            {
                var models = await _model3DRepo.GetModel3DsAsync();
                return Ok(models);
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

        [HttpGet("model3d/{id}")]
        public async Task<IActionResult> GetModel3DByID(Guid id)
        {
            try
            {
                var model = await _model3DRepo.GetModel3DByIDAsync(id);
                if (model == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Model not found"
                    });
                }
                return Ok(model);
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

        [HttpDelete("model3d/{id}")]
        public async Task<IActionResult> DeleteModel3D(Guid id)
        {
            try
            {
                var existingModel = await _model3DRepo.GetModel3DByIDAsync(id);
                if (existingModel == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Model not found"
                    });
                }

                await _model3DRepo.DeleteModel3DAsync(existingModel);
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

        [HttpPut("model3d")]
        public async Task<IActionResult> UpdateModel3D(Model3D modelToUpdate)
        {
            try
            {
                var existingModel = await _model3DRepo.GetModel3DByIDAsync(modelToUpdate.ModelID);
                if (existingModel == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Model not found"
                    });
                }

                // Update fields
                existingModel.ModelTitle = modelToUpdate.ModelTitle;
                existingModel.ModelDateGen = modelToUpdate.ModelDateGen;
                existingModel.FilePath = modelToUpdate.FilePath;
                existingModel.GPCID = modelToUpdate.GPCID;

                await _model3DRepo.UpdateModel3DAsync(existingModel);
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
