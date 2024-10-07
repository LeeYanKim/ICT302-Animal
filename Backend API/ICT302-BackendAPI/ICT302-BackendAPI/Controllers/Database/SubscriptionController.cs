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
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionRepository _subscriptionRepo;
        private readonly ILogger<SubscriptionController> _logger;

        public SubscriptionController(ISubscriptionRepository subscriptionRepo, ILogger<SubscriptionController> logger)
        {
            _subscriptionRepo = subscriptionRepo;
            _logger = logger;
        }

        [HttpPost("subscription")]
        public async Task<ActionResult> AddSubscriptionAsync([FromBody] Subscription subscription)
        {
            try
            {
                subscription.SubscriptionID = Guid.NewGuid();
                return Ok(await _subscriptionRepo.CreateSubscriptionAsync(subscription));
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

        [HttpGet("subscriptions")]
        public async Task<ActionResult> GetSubscriptionsAsync()
        {
            try
            {
                var subscriptions = await _subscriptionRepo.GetSubscriptionsAsync();
                return Ok(subscriptions);
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

        [HttpGet("subscription/{id}")]
        public async Task<IActionResult> GetSubscriptionByID(Guid id)
        {
            try
            {
                var subscription = await _subscriptionRepo.GetSubscriptionByIDAsync(id);
                if (subscription == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(subscription);
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

        [HttpDelete("subscription/{id}")]
        public async Task<IActionResult> DeleteSubscription(Guid id)
        {
            try
            {
                var existingSubscription = await _subscriptionRepo.GetSubscriptionByIDAsync(id);
                if (existingSubscription == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _subscriptionRepo.DeleteSubscriptionAsync(existingSubscription);
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

        [HttpPut("subscription")]
        public async Task<IActionResult> UpdateSubscription([FromBody] Subscription subscriptionToUpdate)
        {
            try
            {
                var existingSubscription = await _subscriptionRepo.GetSubscriptionByIDAsync(subscriptionToUpdate.SubscriptionID);
                if (existingSubscription == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingSubscription.SubscriptionTitle = subscriptionToUpdate.SubscriptionTitle;
                existingSubscription.StorageSize = subscriptionToUpdate.StorageSize;
                existingSubscription.ChargeRate = subscriptionToUpdate.ChargeRate;

                await _subscriptionRepo.UpdateSubscriptionAsync(existingSubscription);
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
