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
    public class JobsCompletedController : ControllerBase
    {
        private readonly IJobsCompletedRepository _jobsCompletedRepo;
        private readonly ILogger<JobsCompletedController> _logger;

        public JobsCompletedController(IJobsCompletedRepository jobsCompletedRepo, ILogger<JobsCompletedController> logger)
        {
            _jobsCompletedRepo = jobsCompletedRepo;
            _logger = logger;
        }

        [HttpPost("jobscompleted")]
        public async Task<ActionResult> AddJobsCompletedAsync([FromBody] JobsCompleted job)
        {
            try
            {
                job.JobID = Guid.NewGuid();
                return Ok(await _jobsCompletedRepo.CreateJobsCompletedAsync(job));
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

        [HttpGet("jobscompleted")]
        public async Task<ActionResult> GetJobsCompletedAsync()
        {
            try
            {
                var jobs = await _jobsCompletedRepo.GetJobsCompletedAsync();
                return Ok(jobs);
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

        [HttpGet("jobscompleted/{id}")]
        public async Task<IActionResult> GetJobsCompletedByID(Guid id)
        {
            try
            {
                var job = await _jobsCompletedRepo.GetJobsCompletedByIDAsync(id);
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

        [HttpDelete("jobscompleted/{id}")]
        public async Task<IActionResult> DeleteJobsCompleted(Guid id)
        {
            try
            {
                var existingJob = await _jobsCompletedRepo.GetJobsCompletedByIDAsync(id);
                if (existingJob == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _jobsCompletedRepo.DeleteJobsCompletedAsync(existingJob);
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

        [HttpPut("jobscompleted")]
        public async Task<IActionResult> UpdateJobsCompleted([FromBody] JobsCompleted jobToUpdate)
        {
            try
            {
                var existingJob = await _jobsCompletedRepo.GetJobsCompletedByIDAsync(jobToUpdate.JobID);
                if (existingJob == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingJob.JobType = jobToUpdate.JobType;
                existingJob.JobsStart = jobToUpdate.JobsStart;
                existingJob.JobsEnd = jobToUpdate.JobsEnd;
                existingJob.JobSize = jobToUpdate.JobSize;
                existingJob.ModelID = jobToUpdate.ModelID;

                await _jobsCompletedRepo.UpdateJobsCompletedAsync(existingJob);
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
