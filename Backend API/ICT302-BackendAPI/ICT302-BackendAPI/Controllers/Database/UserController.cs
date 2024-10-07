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
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserRepository userRepo, ILogger<UserController> logger)
        {
            _userRepo = userRepo;
            _logger = logger;
        }

        [HttpPost("user")]
        public async Task<ActionResult> AddUserAsync([FromBody] User user)
        {
            try
            {
                user.UserID = Guid.NewGuid();
                return Ok(await _userRepo.CreateUserAsync(user));
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

        [HttpGet("users")]
        public async Task<ActionResult> GetUsersAsync()
        {
            try
            {
                var users = await _userRepo.GetUsersAsync();
                return Ok(users);
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

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserByID(Guid id)
        {
            try
            {
                var user = await _userRepo.GetUserByIDAsync(id);
                if (user == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(user);
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

        [HttpDelete("user/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                var existingUser = await _userRepo.GetUserByIDAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _userRepo.DeleteUserAsync(existingUser);
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

        [HttpPut("user")]
        public async Task<IActionResult> UpdateUser([FromBody] User userToUpdate)
        {
            try
            {
                var existingUser = await _userRepo.GetUserByIDAsync(userToUpdate.UserID);
                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingUser.UserName = userToUpdate.UserName;
                existingUser.UserEmail = userToUpdate.UserEmail;
                existingUser.UserPassword = userToUpdate.UserPassword;
                existingUser.PermissionLevel = userToUpdate.PermissionLevel;
                existingUser.UserDateJoin = userToUpdate.UserDateJoin;
                existingUser.SubscriptionID = userToUpdate.SubscriptionID;

                await _userRepo.UpdateUserAsync(existingUser);
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
