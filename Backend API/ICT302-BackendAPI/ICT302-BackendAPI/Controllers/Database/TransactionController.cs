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
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepo;
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(ITransactionRepository transactionRepo, ILogger<TransactionController> logger)
        {
            _transactionRepo = transactionRepo;
            _logger = logger;
        }

        [HttpPost("transaction")]
        public async Task<ActionResult> AddTransactionAsync([FromBody] Transaction transaction)
        {
            try
            {
                transaction.TransactionID = Guid.NewGuid();
                return Ok(await _transactionRepo.CreateTransactionAsync(transaction));
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

        [HttpGet("transactions")]
        public async Task<ActionResult> GetTransactionsAsync()
        {
            try
            {
                var transactions = await _transactionRepo.GetTransactionsAsync();
                return Ok(transactions);
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

        [HttpGet("transaction/{id}")]
        public async Task<IActionResult> GetTransactionByID(Guid id)
        {
            try
            {
                var transaction = await _transactionRepo.GetTransactionByIDAsync(id);
                if (transaction == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }
                return Ok(transaction);
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

        [HttpDelete("transaction/{id}")]
        public async Task<IActionResult> DeleteTransaction(Guid id)
        {
            try
            {
                var existingTransaction = await _transactionRepo.GetTransactionByIDAsync(id);
                if (existingTransaction == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                await _transactionRepo.DeleteTransactionAsync(existingTransaction);
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

        [HttpPut("transaction")]
        public async Task<IActionResult> UpdateTransaction([FromBody] Transaction transactionToUpdate)
        {
            try
            {
                var existingTransaction = await _transactionRepo.GetTransactionByIDAsync(transactionToUpdate.TransactionID);
                if (existingTransaction == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "Record not found"
                    });
                }

                existingTransaction.TransTypeID = transactionToUpdate.TransTypeID;
                existingTransaction.UserID = transactionToUpdate.UserID;
                existingTransaction.AnimalID = transactionToUpdate.AnimalID;

                await _transactionRepo.UpdateTransactionAsync(existingTransaction);
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
