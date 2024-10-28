using FirebaseAdmin.Auth;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Controllers.Database
{
    public class AddUserRequest
    {
        public string? userName { get; set; }
        public string? userEmail { get; set; }
        public string? permissionLevel { get; set; }
    }
    
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
        public async Task<ActionResult> AddUserAsync([FromHeader] string authorization, [FromBody] AddUserRequest userRequested)
        {
            
            User user = new User();
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return Unauthorized(new
                {
                    statusCode = 401,
                    message = "No token provided"
                });
            }

            try
            {
                // Extract the Firebase token from the Authorization header
                var token = authorization.Substring("Bearer ".Length).Trim();

                // Verify the Firebase token using Firebase Admin SDK
                string firebaseUid = "";
                try
                {
                    FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
                    firebaseUid = decodedToken.Uid;
                }
                catch (FirebaseAuthException ex)
                {
                    _logger.LogError(ex.Message);
                    return Unauthorized(new
                    {
                        statusCode = 401,
                        message = "Invalid Firebase token"
                    });
                }
                

                // Generate the UserID from the Firebase UID (ensuring the user cannot set their own UserID)
                user.UserID = GuidHelper.ConvertFirebaseUidToGuid(firebaseUid);

                // Check if the user already exists in the database
                try
                {
                    var existingUser = await _userRepo.GetUserByIDAsync(user.UserID);
                    if (existingUser == null)
                    {
                        // User doesn't exist, so we create a new one
                        user.UserDateJoin = DateTime.UtcNow; // Automatically set the join date
                        user.PermissionLevel =
                            userRequested.permissionLevel ?? "user"; // Default permission level if not provided

                        
                        user.Subscription = (await _userRepo.GetDefaultSubscriptionAsync())!;
                        user.SubscriptionID = user.Subscription!.SubscriptionID;
                        
                        user.UserPassword = "";
                        user.UserEmail = userRequested.userEmail!;
                        user.UserName = userRequested.userName!;

                        var createdUser = await _userRepo.CreateUserAsync(user);

                        return Ok(new
                        {
                            statusCode = 200,
                            message = "User created successfully",
                            userId = createdUser!.UserID
                        });
                    }

                    // If the user exists, update only allowed fields
                    existingUser.UserName = string.IsNullOrEmpty(user.UserName) ? existingUser.UserName : user.UserName;
                    existingUser.UserEmail = string.IsNullOrEmpty(user.UserEmail) ? existingUser.UserEmail : user.UserEmail;
                    existingUser.PermissionLevel = string.IsNullOrEmpty(user.PermissionLevel) ? existingUser.PermissionLevel : user.PermissionLevel;

                    // Update the user in the database
                    await _userRepo.UpdateUserAsync(existingUser);
                    
                    return Ok(new
                    {
                        statusCode = 200,
                        message = "User updated successfully",
                        userId = existingUser.UserID.ToString()
                    });
                    
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
                // Retrieve the user's email from the local database
                var email = await _userRepo.GetEmailByIDAsync(id);
                if (string.IsNullOrEmpty(email))
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Email not found for this user"
                    });
                }

                // Use the Firebase Admin SDK to get the user by email
                var firebaseAuth = FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance;
                UserRecord userRecord;
                try
                {
                    userRecord = await firebaseAuth.GetUserByEmailAsync(email);
                }
                catch (FirebaseAdmin.Auth.FirebaseAuthException firebaseEx)
                {
                    _logger.LogError(firebaseEx, "Error occurred while retrieving user from Firebase.");
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        statusCode = 500,
                        message = "Firebase user retrieval failed"
                    });
                }

                // Delete the user from Firebase using the Firebase UID
                try
                {
                    await firebaseAuth.DeleteUserAsync(userRecord.Uid);
                }
                catch (FirebaseAdmin.Auth.FirebaseAuthException firebaseEx)
                {
                    _logger.LogError(firebaseEx, "Error occurred while deleting user from Firebase.");
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        statusCode = 500,
                        message = $"Firebase deletion failed: {firebaseEx.Message}"
                    });
                }

                // Perform any local database deletion
                var existingUser = await _userRepo.GetUserByIDAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found in the local database"
                    });
                }

                await _userRepo.DeleteUserAsync(existingUser);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error occurred while processing the delete request.");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }
        
        [HttpGet("user/{id}/email")]
        public async Task<IActionResult> GetEmailById(Guid id)
        {
            try
            {
                // Call the repository method to get the email by the userID
                var email = await _userRepo.GetEmailByIDAsync(id);
        
                if (string.IsNullOrEmpty(email))
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Email not found for this user"
                    });
                }

                return Ok(new
                {
                    statusCode = 200,
                    email = email
                });
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
