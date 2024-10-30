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
    public class JobsPendingController : ControllerBase
    {
        private readonly IJobsPendingRepository _jobsPendingRepo;
        private readonly ILogger<JobsPendingController> _logger;

        public JobsPendingController(IJobsPendingRepository jobsPendingRepo, ILogger<JobsPendingController> logger)
        {
            _jobsPendingRepo = jobsPendingRepo;
            _logger = logger;
        }

        [HttpPost("jobspending")]
        public async Task<ActionResult> AddJobsPendingAsync([FromBody] JobsPending jobsPending)
        {
            try
            {
                var currentPendingJobs = await _jobsPendingRepo.GetJobsPendingAsync();
                if (currentPendingJobs!.Any())
                {
                    jobsPending.QueueNumber = currentPendingJobs!.Count + 1;
                }
                else
                {
                    jobsPending.QueueNumber = 1;
                }
                
                return Ok(await _jobsPendingRepo.CreateJobsPendingAsync(jobsPending));
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

        [HttpGet("jobspending")]
        public async Task<ActionResult> GetJobsPendingAsync()
        {
            try
            {
                var jobsPending = await _jobsPendingRepo.GetJobsPendingAsync();
                return Ok(jobsPending);
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

        [HttpGet("jobspending/{id}")]
        public async Task<IActionResult> GetJobsPendingByID(int id)
        {
            try
            {
                var job = await _jobsPendingRepo.GetJobsPendingByIDAsync(id);
                if (job == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(job);
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

        [HttpDelete("jobspending/{id}")]
        public async Task<IActionResult> DeleteJobsPending(int id)
        {
            try
            {
                var existingJob = await _jobsPendingRepo.GetJobsPendingByIDAsync(id);
                if (existingJob == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _jobsPendingRepo.DeleteJobsPendingAsync(existingJob);
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

        [HttpPut("jobspending")]
        public async Task<IActionResult> UpdateJobsPending([FromBody] JobsPending jobsPendingToUpdate)
        {
            try
            {
                var existingJob = await _jobsPendingRepo.GetJobsPendingByIDAsync(jobsPendingToUpdate.QueueNumber);
                if (existingJob == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingJob.JobAdded = jobsPendingToUpdate.JobAdded;
                existingJob.Status = jobsPendingToUpdate.Status;
                existingJob.JobDetails = jobsPendingToUpdate.JobDetails;

                await _jobsPendingRepo.UpdateJobsPendingAsync(existingJob);
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
