using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;

namespace ICT302_BackendAPI.Controllers.Database
{
    [Route("api/db")]
    [ApiController]
    public class AnimalAccessController : ControllerBase
    {
        private readonly IAnimalAccessRepository _animalAccessRepo;
        private readonly ILogger<AnimalAccessController> _logger;

        public AnimalAccessController(IAnimalAccessRepository animalAccessRepo, ILogger<AnimalAccessController> logger)
        {
            _animalAccessRepo = animalAccessRepo;
            _logger = logger;
        }

        [HttpPost("animalaccess")]
        public async Task<ActionResult> AddAnimalAccessAsync([FromBody] AnimalAccess animalAccess)
        {
            try
            {
                animalAccess.AccessID = Guid.NewGuid();
                return Ok(await _animalAccessRepo.CreateAnimalAccessAsync(animalAccess));
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

        [HttpGet("animalaccesses")]
        public async Task<ActionResult> GetAnimalAccessesAsync()
        {
            try
            {
                var animalAccesses = await _animalAccessRepo.GetAnimalAccessesAsync();
                return Ok(animalAccesses);
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

        [HttpGet("animalaccess/{id}")]
        public async Task<IActionResult> GetAnimalAccessByID(Guid id)
        {
            try
            {
                var animalAccess = await _animalAccessRepo.GetAnimalAccessByIDAsync(id);
                if (animalAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(animalAccess);
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

        [HttpDelete("animalaccess/{id}")]
        public async Task<IActionResult> DeleteAnimalAccess(Guid id)
        {
            try
            {
                var existingAnimalAccess = await _animalAccessRepo.GetAnimalAccessByIDAsync(id);
                if (existingAnimalAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _animalAccessRepo.DeleteAnimalAccessAsync(existingAnimalAccess);
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

        [HttpPut("animalaccess")]
        public async Task<IActionResult> UpdateAnimalAccess([FromBody] AnimalAccess animalAccessToUpdate)
        {
            try
            {
                var existingAnimalAccess = await _animalAccessRepo.GetAnimalAccessByIDAsync(animalAccessToUpdate.AccessID);
                if (existingAnimalAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingAnimalAccess.AccessType = animalAccessToUpdate.AccessType;
                existingAnimalAccess.AssignedDate = animalAccessToUpdate.AssignedDate;
                existingAnimalAccess.AnimalID = animalAccessToUpdate.AnimalID;
                existingAnimalAccess.UserID = animalAccessToUpdate.UserID;

                await _animalAccessRepo.UpdateAnimalAccessAsync(existingAnimalAccess);
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
