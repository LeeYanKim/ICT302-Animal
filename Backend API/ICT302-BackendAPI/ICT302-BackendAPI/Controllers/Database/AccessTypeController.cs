using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ICT302_BackendAPI.Controllers.Database
{
    [Route("api/db")]
    [ApiController]
    public class AccessTypeController : ControllerBase
    {
        private readonly IAccessTypeRepository _accessTypeRepo;
        private readonly ILogger<AccessTypeController> _logger;

        public AccessTypeController(IAccessTypeRepository accessTypeRepo, ILogger<AccessTypeController> logger)
        {
            _accessTypeRepo = accessTypeRepo;
            _logger = logger;
        }

        [HttpPost("accesstypes")]
        public async Task<ActionResult> AddAccessTypeAsync([FromBody] AccessType accessType)
        {
            try
            {
                accessType.AccessTypeID = Guid.NewGuid(); // Ensure a new GUID is generated for each access type
                return Ok(await _accessTypeRepo.CreateAccessTypeAsync(accessType));
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

        [HttpGet("accesstypes")]
        public async Task<ActionResult> GetAccessTypesAsync()
        {
            try
            {
                var accessTypes = await _accessTypeRepo.GetAccessTypesAsync();
                return Ok(accessTypes);
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

        [HttpGet("accesstype/{id}")]
        public async Task<IActionResult> GetAccessTypeByID(Guid id)
        {
            try
            {
                var accessType = await _accessTypeRepo.GetAccessTypeByIDAsync(id);
                if (accessType == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Access type not found"
                    });
                }
                return Ok(accessType);
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

        [HttpDelete("accesstype/{id}")]
        public async Task<IActionResult> DeleteAccessType(Guid id)
        {
            try
            {
                var existingAccessType = await _accessTypeRepo.GetAccessTypeByIDAsync(id);
                if (existingAccessType == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Access type not found"
                    });
                }

                await _accessTypeRepo.DeleteAccessTypeAsync(existingAccessType);
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

        [HttpPut("accesstype")]
        public async Task<IActionResult> UpdateAccessType(AccessType accessTypeToUpdate)
        {
            try
            {
                var existingAccessType = await _accessTypeRepo.GetAccessTypeByIDAsync(accessTypeToUpdate.AccessTypeID);
                if (existingAccessType == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Access type not found"
                    });
                }

                existingAccessType.AccessTypeDetails = accessTypeToUpdate.AccessTypeDetails;
                await _accessTypeRepo.UpdateAccessTypeAsync(existingAccessType);
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
