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
    public class JobDetailsController : ControllerBase
    {
        private readonly IJobDetailsRepository _jobDetailsRepo;
        private readonly ILogger<JobDetailsController> _logger;

        public JobDetailsController(IJobDetailsRepository jobDetailsRepo, ILogger<JobDetailsController> logger)
        {
            _jobDetailsRepo = jobDetailsRepo;
            _logger = logger;
        }

        [HttpPost("jobdetails")]
        public async Task<ActionResult> AddJobDetailsAsync([FromBody] JobDetails jobDetails)
        {
            try
            {
                jobDetails.JDID = Guid.NewGuid();
                return Ok(await _jobDetailsRepo.CreateJobDetailsAsync(jobDetails));
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

        [HttpGet("jobdetails")]
        public async Task<ActionResult> GetJobDetailsAsync()
        {
            try
            {
                var jobDetails = await _jobDetailsRepo.GetJobDetailsAsync();
                return Ok(jobDetails);
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

        [HttpGet("jobdetails/{id}")]
        public async Task<IActionResult> GetJobDetailsByID(Guid id)
        {
            try
            {
                var jobDetails = await _jobDetailsRepo.GetJobDetailsByIDAsync(id);
                if (jobDetails == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(jobDetails);
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

        [HttpDelete("jobdetails/{id}")]
        public async Task<IActionResult> DeleteJobDetails(Guid id)
        {
            try
            {
                var existingJobDetails = await _jobDetailsRepo.GetJobDetailsByIDAsync(id);
                if (existingJobDetails == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _jobDetailsRepo.DeleteJobDetailsAsync(existingJobDetails);
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

        [HttpPut("jobdetails")]
        public async Task<IActionResult> UpdateJobDetails([FromBody] JobDetails jobDetailsToUpdate)
        {
            try
            {
                var existingJobDetails = await _jobDetailsRepo.GetJobDetailsByIDAsync(jobDetailsToUpdate.JDID);
                if (existingJobDetails == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingJobDetails.JobID = jobDetailsToUpdate.JobID;

                await _jobDetailsRepo.UpdateJobDetailsAsync(existingJobDetails);
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
