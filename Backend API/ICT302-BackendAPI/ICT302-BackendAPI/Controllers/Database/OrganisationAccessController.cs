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
    public class OrganisationAccessController : ControllerBase
    {
        private readonly IOrganisationAccessRepository _organisationAccessRepo;
        private readonly ILogger<OrganisationAccessController> _logger;

        public OrganisationAccessController(IOrganisationAccessRepository organisationAccessRepo, ILogger<OrganisationAccessController> logger)
        {
            _organisationAccessRepo = organisationAccessRepo;
            _logger = logger;
        }

        [HttpPost("organisationaccess")]
        public async Task<ActionResult> AddOrganisationAccessAsync([FromBody] OrganisationAccess organisationAccess)
        {
            try
            {
                organisationAccess.OrgAccessID = Guid.NewGuid();
                return Ok(await _organisationAccessRepo.CreateOrganisationAccessAsync(organisationAccess));
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

        [HttpGet("organisationaccesses")]
        public async Task<ActionResult> GetOrganisationAccessesAsync()
        {
            try
            {
                var organisationAccesses = await _organisationAccessRepo.GetOrganisationAccessesAsync();
                return Ok(organisationAccesses);
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

        [HttpGet("organisationaccess/{id}")]
        public async Task<IActionResult> GetOrganisationAccessByID(Guid id)
        {
            try
            {
                var organisationAccess = await _organisationAccessRepo.GetOrganisationAccessByIDAsync(id);
                if (organisationAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(organisationAccess);
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

        [HttpDelete("organisationaccess/{id}")]
        public async Task<IActionResult> DeleteOrganisationAccess(Guid id)
        {
            try
            {
                var existingOrganisationAccess = await _organisationAccessRepo.GetOrganisationAccessByIDAsync(id);
                if (existingOrganisationAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _organisationAccessRepo.DeleteOrganisationAccessAsync(existingOrganisationAccess);
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

        [HttpPut("organisationaccess")]
        public async Task<IActionResult> UpdateOrganisationAccess([FromBody] OrganisationAccess organisationAccessToUpdate)
        {
            try
            {
                var existingOrganisationAccess = await _organisationAccessRepo.GetOrganisationAccessByIDAsync(organisationAccessToUpdate.OrgAccessID);
                if (existingOrganisationAccess == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingOrganisationAccess.OrgAccessID = organisationAccessToUpdate.OrgAccessID;
                existingOrganisationAccess.AccessType = organisationAccessToUpdate.AccessType;
                existingOrganisationAccess.AssignedDate = organisationAccessToUpdate.AssignedDate;
                existingOrganisationAccess.OrgID = organisationAccessToUpdate.OrgID;
                existingOrganisationAccess.AccessID = organisationAccessToUpdate.AccessID;

                await _organisationAccessRepo.UpdateOrganisationAccessAsync(existingOrganisationAccess);
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
