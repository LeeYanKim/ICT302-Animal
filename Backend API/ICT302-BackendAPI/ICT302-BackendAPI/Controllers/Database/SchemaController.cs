using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ICT302_BackendAPI.Controllers.Database
{
    [Route("api/db")]
    [ApiController]
    public class SchemaController : ControllerBase
    {
        private readonly ISchemaRepository _schemaRepo;
        private readonly ILogger<SchemaController> _logger;


        public SchemaController(ISchemaRepository schemaRepo, ILogger<SchemaController> logger)
        {
            _schemaRepo = schemaRepo;
            _logger = logger;
        }

        [HttpGet("animals")]
        public async Task<ActionResult> GetAnimalsAsync()
        {
            try
            {
                var animals = await _schemaRepo.GetAnimalsAsync();
                return Ok(animals);
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

        [HttpGet("animal/{id}")]
        public async Task<IActionResult> GetAnimalByID(Guid id)
        {
            try
            {
                var animal = await _schemaRepo.GetAnimalByIDAsync(id);
                if (animal == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "record not found"
                    });
                }
                return Ok(animal);
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

        [HttpDelete("animal/{id}")]
        public async Task<IActionResult> DeleteAnimal(Guid id)
        {
            try
            {
                var existingAnimal = await _schemaRepo.GetAnimalByIDAsync(id);
                if (existingAnimal == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "record not found"
                    });
                }

                await _schemaRepo.DeleteAnimalAsync(existingAnimal);
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

        [HttpPut("animal")]
        public async Task<IActionResult> UpdateAnimal(Animal animalToUpdate)
        {
            try
            {
                var existingAnimal= await _schemaRepo.GetAnimalByIDAsync(animalToUpdate.AnimalID);
                if (existingAnimal == null)
                {
                    return NotFound(new
                    {
                        statusCode = 404,
                        message = "record not found"
                    });
                }
                existingAnimal.AnimalID = animalToUpdate.AnimalID;
                existingAnimal.AnimalName = animalToUpdate.AnimalName;
                existingAnimal.AnimalDOB = animalToUpdate.AnimalDOB;
                existingAnimal.AnimalType = animalToUpdate.AnimalType;
                await _schemaRepo.UpdateAnimalAsync(existingAnimal);
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
