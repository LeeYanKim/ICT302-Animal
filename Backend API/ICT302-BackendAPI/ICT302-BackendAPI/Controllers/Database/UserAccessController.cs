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
    public class UserAccessController : ControllerBase
    {
        private readonly IUserAccessRepository _userAccessRepo;
        private readonly ILogger<UserAccessController> _logger;

        public UserAccessController(IUserAccessRepository userAccessRepo, ILogger<UserAccessController> logger)
        {
            _userAccessRepo = userAccessRepo;
            _logger = logger;
        }

        [HttpPost("useraccess")]
        public async Task<ActionResult> AddUserAccessAsync([FromBody] UserAccess userAccess)
        {
            try
            {
                return Ok(await _userAccessRepo.CreateUserAccessAsync(userAccess));
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

        [HttpGet("useraccesses")]
        public async Task<ActionResult> GetUserAccessesAsync()
        {
            try
            {
                var userAccesses = await _userAccessRepo.GetUserAccessesAsync();
                return Ok(userAccesses);
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

        [HttpGet("useraccess/{orgId}/{userId}")]
        public async Task<IActionResult> GetUserAccessByKeys(Guid orgId, Guid userId)
        {
            try
            {
                var userAccess = await _userAccessRepo.GetUserAccessByKeysAsync(orgId, userId);
                if (userAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(userAccess);
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

        [HttpDelete("useraccess/{orgId}/{userId}")]
        public async Task<IActionResult> DeleteUserAccess(Guid orgId, Guid userId)
        {
            try
            {
                var existingUserAccess = await _userAccessRepo.GetUserAccessByKeysAsync(orgId, userId);
                if (existingUserAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _userAccessRepo.DeleteUserAccessAsync(existingUserAccess);
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

        [HttpPut("useraccess")]
        public async Task<IActionResult> UpdateUserAccess([FromBody] UserAccess userAccessToUpdate)
        {
            try
            {
                var existingUserAccess = await _userAccessRepo.GetUserAccessByKeysAsync(userAccessToUpdate.OrgID, userAccessToUpdate.UserID);
                if (existingUserAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingUserAccess.AccessTypeID = userAccessToUpdate.AccessTypeID;
                await _userAccessRepo.UpdateUserAccessAsync(existingUserAccess);
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
