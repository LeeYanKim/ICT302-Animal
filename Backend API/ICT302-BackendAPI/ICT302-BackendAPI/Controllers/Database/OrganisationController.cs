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
    public class OrganisationController : ControllerBase
    {
        private readonly IOrganisationRepository _organisationRepo;
        private readonly ILogger<OrganisationController> _logger;

        public OrganisationController(IOrganisationRepository organisationRepo, ILogger<OrganisationController> logger)
        {
            _organisationRepo = organisationRepo;
            _logger = logger;
        }

        [HttpPost("organisations")]
        public async Task<ActionResult> AddOrganisationAsync([FromBody] Organisation organisation)
        {
            try
            {
                organisation.OrgID = Guid.NewGuid();
                return Ok(await _organisationRepo.CreateOrganisationAsync(organisation));
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

        [HttpGet("organisations")]
        public async Task<ActionResult> GetOrganisationsAsync()
        {
            try
            {
                var organisations = await _organisationRepo.GetOrganisationsAsync();
                return Ok(organisations);
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

        [HttpGet("organisation/{id}")]
        public async Task<IActionResult> GetOrganisationByID(Guid id)
        {
            try
            {
                var organisation = await _organisationRepo.GetOrganisationByIDAsync(id);
                if (organisation == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(organisation);
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

        [HttpDelete("organisation/{id}")]
        public async Task<IActionResult> DeleteOrganisation(Guid id)
        {
            try
            {
                var existingOrganisation = await _organisationRepo.GetOrganisationByIDAsync(id);
                if (existingOrganisation == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _organisationRepo.DeleteOrganisationAsync(existingOrganisation);
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

        [HttpPut("organisation")]
        public async Task<IActionResult> UpdateOrganisation([FromBody] Organisation organisationToUpdate)
        {
            try
            {
                var existingOrganisation = await _organisationRepo.GetOrganisationByIDAsync(organisationToUpdate.OrgID);
                if (existingOrganisation == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingOrganisation.OrgID = organisationToUpdate.OrgID;
                existingOrganisation.OrgName = organisationToUpdate.OrgName;
                existingOrganisation.OrgEmail = organisationToUpdate.OrgEmail;

                await _organisationRepo.UpdateOrganisationAsync(existingOrganisation);
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
