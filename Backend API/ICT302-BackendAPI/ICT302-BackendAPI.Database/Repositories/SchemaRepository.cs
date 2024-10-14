// SchemaRepository.cs
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
            return await _ctx.Animals.ToListAsync();
        }

       public async Task<Animal> GetAnimalByIDAsync(Guid id)
{
    var animal = await _ctx.Animals
        .Include(a => a.Graphics)  // Eager load graphics
        .FirstOrDefaultAsync(a => a.AnimalID == id);

    // Ensure Graphics is never null
    animal.Graphics ??= new List<Graphic>();
    return animal;
}



        // Get animal by name and date of birth
        public async Task<Animal> GetAnimalByNameAndDOBAsync(string name, DateTime dob)
        {
            return await _ctx.Animals.FirstOrDefaultAsync(a => a.AnimalName == name && a.AnimalDOB == dob);
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
    }
}
