// Database/Repositories/SchemaRepository.cs
using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class SchemaRepository : ISchemaRepository
    {
        private readonly SchemaContext _ctx;

        public SchemaRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        // Get all animals
        public async Task<IEnumerable<Animal>> GetAnimalsAsync()
        {
            var animals = await _ctx.Animals.ToListAsync();
            return animals;
        }

        // Get animal by ID
        public async Task<Animal> GetAnimalByIDAsync(Guid id)
        {
            var animal = await _ctx.Animals.FindAsync(id);
            return animal;
        }

        // Create a new animal
        public async Task<Animal> CreateAnimalAsync(Animal animal)
        {
            _ctx.Animals.Add(animal);
            await _ctx.SaveChangesAsync();
            return animal;
        }

        // Update an existing animal
        public async Task<Animal> UpdateAnimalAsync(Animal animal)
        {
            _ctx.Animals.Update(animal);
            await _ctx.SaveChangesAsync();
            return animal;
        }

        // Delete an animal
        public async Task<int> DeleteAnimalAsync(Animal animal)
        {
            _ctx.Animals.Remove(animal);
            return await _ctx.SaveChangesAsync();
        }

        // Update animal video data
        public async Task<Animal> UpdateAnimalVideoDataAsync(Guid animalId, string videoFileName, DateTime uploadDate)
        {
            var animal = await _ctx.Animals.FindAsync(animalId);
            if (animal == null)
            {
                return null; // Animal not found
            }

            animal.VideoFileName = videoFileName;
            animal.VideoUploadDate = uploadDate;

            _ctx.Animals.Update(animal);
            await _ctx.SaveChangesAsync();

            return animal;
        }
    }
}
