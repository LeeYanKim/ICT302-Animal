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
    public class TransactionTypeController : ControllerBase
    {
        private readonly ITransactionTypeRepository _transactionTypeRepo;
        private readonly ILogger<TransactionTypeController> _logger;

        public TransactionTypeController(ITransactionTypeRepository transactionTypeRepo, ILogger<TransactionTypeController> logger)
        {
            _transactionTypeRepo = transactionTypeRepo;
            _logger = logger;
        }

        [HttpPost("transactiontype")]
        public async Task<ActionResult> AddTransactionTypeAsync([FromBody] TransactionType transactionType)
        {
            try
            {
                transactionType.TransTypeID = Guid.NewGuid();
                return Ok(await _transactionTypeRepo.CreateTransactionTypeAsync(transactionType));
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

        [HttpGet("transactiontypes")]
        public async Task<ActionResult> GetTransactionTypesAsync()
        {
            try
            {
                var transactionTypes = await _transactionTypeRepo.GetTransactionTypesAsync();
                return Ok(transactionTypes);
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

        [HttpGet("transactiontype/{id}")]
        public async Task<IActionResult> GetTransactionTypeByID(Guid id)
        {
            try
            {
                var transactionType = await _transactionTypeRepo.GetTransactionTypeByIDAsync(id);
                if (transactionType == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(transactionType);
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

        [HttpDelete("transactiontype/{id}")]
        public async Task<IActionResult> DeleteTransactionType(Guid id)
        {
            try
            {
                var existingTransactionType = await _transactionTypeRepo.GetTransactionTypeByIDAsync(id);
                if (existingTransactionType == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _transactionTypeRepo.DeleteTransactionTypeAsync(existingTransactionType);
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

        [HttpPut("transactiontype")]
        public async Task<IActionResult> UpdateTransactionType([FromBody] TransactionType transactionTypeToUpdate)
        {
            try
            {
                var existingTransactionType = await _transactionTypeRepo.GetTransactionTypeByIDAsync(transactionTypeToUpdate.TransTypeID);
                if (existingTransactionType == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingTransactionType.TransDetails = transactionTypeToUpdate.TransDetails;

                await _transactionTypeRepo.UpdateTransactionTypeAsync(existingTransactionType);
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
