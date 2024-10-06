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
    public class OrgRequestsController : ControllerBase
    {
        private readonly IOrgRequestsRepository _orgRequestsRepo;
        private readonly ILogger<OrgRequestsController> _logger;

        public OrgRequestsController(IOrgRequestsRepository orgRequestsRepo, ILogger<OrgRequestsController> logger)
        {
            _orgRequestsRepo = orgRequestsRepo;
            _logger = logger;
        }

        [HttpPost("orgrequests")]
        public async Task<ActionResult> AddOrgRequestAsync([FromBody] OrgRequests orgRequests)
        {
            try
            {
                orgRequests.RequestID = Guid.NewGuid();
                return Ok(await _orgRequestsRepo.CreateOrgRequestsAsync(orgRequests));
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

        [HttpGet("orgrequests")]
        public async Task<ActionResult> GetOrgRequestsAsync()
        {
            try
            {
                var orgRequests = await _orgRequestsRepo.GetOrgRequestsAsync();
                return Ok(orgRequests);
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

        [HttpGet("orgrequests/{id}")]
        public async Task<IActionResult> GetOrgRequestByID(Guid id)
        {
            try
            {
                var orgRequest = await _orgRequestsRepo.GetOrgRequestsByIDAsync(id);
                if (orgRequest == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(orgRequest);
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

        [HttpDelete("orgrequests/{id}")]
        public async Task<IActionResult> DeleteOrgRequest(Guid id)
        {
            try
            {
                var existingOrgRequest = await _orgRequestsRepo.GetOrgRequestsByIDAsync(id);
                if (existingOrgRequest == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _orgRequestsRepo.DeleteOrgRequestsAsync(existingOrgRequest);
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

        [HttpPut("orgrequests")]
        public async Task<IActionResult> UpdateOrgRequest([FromBody] OrgRequests orgRequestToUpdate)
        {
            try
            {
                var existingOrgRequest = await _orgRequestsRepo.GetOrgRequestsByIDAsync(orgRequestToUpdate.RequestID);
                if (existingOrgRequest == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingOrgRequest.OrgID = orgRequestToUpdate.OrgID;
                existingOrgRequest.UserID = orgRequestToUpdate.UserID;
                existingOrgRequest.DateRequested = orgRequestToUpdate.DateRequested;
                existingOrgRequest.DateProcessed = orgRequestToUpdate.DateProcessed;
                existingOrgRequest.Status = orgRequestToUpdate.Status;

                await _orgRequestsRepo.UpdateOrgRequestsAsync(existingOrgRequest);
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
