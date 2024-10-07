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
    public class BillingController : ControllerBase
    {
        private readonly IBillingRepository _billingRepo;
        private readonly ILogger<BillingController> _logger;

        public BillingController(IBillingRepository billingRepo, ILogger<BillingController> logger)
        {
            _billingRepo = billingRepo;
            _logger = logger;
        }

        [HttpPost("billing")]
        public async Task<ActionResult> AddBillingAsync([FromBody] Billing billing)
        {
            try
            {
                billing.BillingID = Guid.NewGuid();
                return Ok(await _billingRepo.CreateBillingAsync(billing));
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

        [HttpGet("billings")]
        public async Task<ActionResult> GetBillingsAsync()
        {
            try
            {
                var billings = await _billingRepo.GetBillingsAsync();
                return Ok(billings);
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

        [HttpGet("billing/{id}")]
        public async Task<IActionResult> GetBillingByID(Guid id)
        {
            try
            {
                var billing = await _billingRepo.GetBillingByIDAsync(id);
                if (billing == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(billing);
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

        [HttpDelete("billing/{id}")]
        public async Task<IActionResult> DeleteBilling(Guid id)
        {
            try
            {
                var existingBilling = await _billingRepo.GetBillingByIDAsync(id);
                if (existingBilling == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _billingRepo.DeleteBillingAsync(existingBilling);
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

        [HttpPut("billing")]
        public async Task<IActionResult> UpdateBilling([FromBody] Billing billingToUpdate)
        {
            try
            {
                var existingBilling = await _billingRepo.GetBillingByIDAsync(billingToUpdate.BillingID);
                if (existingBilling == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingBilling.UserID = billingToUpdate.UserID;

                await _billingRepo.UpdateBillingAsync(existingBilling);
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
