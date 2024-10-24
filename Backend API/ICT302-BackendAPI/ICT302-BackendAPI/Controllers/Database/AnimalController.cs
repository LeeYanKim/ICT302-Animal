﻿using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ICT302_BackendAPI.Controllers.Database;

[Route("api/db")]
[ApiController]
public class AnimalController : ControllerBase
{
    private readonly IAnimalRepository _animalRepo;
    private readonly ILogger<AnimalController> _logger;
    
    public AnimalController(IAnimalRepository animalRepo, ILogger<AnimalController> logger)
    {
        _animalRepo = animalRepo;
        _logger = logger;
    }
    
    [HttpPost("animals/{animalName}&{animalType}&{animalDOB}")]
    public async Task<ActionResult> AddAnimalAsync(string animalName, string animalType, DateTime animalDOB)
    {
        try
        {
            var animal = new Animal();
            animal.AnimalID = Guid.NewGuid();
            animal.AnimalName = animalName;
            animal.AnimalType = animalType;
            animal.AnimalDOB = animalDOB;
            return Ok(await _animalRepo.CreateAnimalAsync(animal));
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

    [HttpGet("animals")]
    public async Task<ActionResult> GetAnimalsAsync()
    {
        try
        {
            var animals = await _animalRepo.GetAnimalsAsync();
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
            var animal = await _animalRepo.GetAnimalByIdAsync(id);
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
            var existingAnimal = await _animalRepo.GetAnimalByIdAsync(id);
            if (existingAnimal == null)
            {
                return NotFound(new
                {
                    statusCode = 404,
                    message = "record not found"
                });
            }

            await _animalRepo.DeleteAnimalAsync(existingAnimal);
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
            var existingAnimal= await _animalRepo.GetAnimalByIdAsync(animalToUpdate.AnimalID);
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
            await _animalRepo.UpdateAnimalAsync(existingAnimal);
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

