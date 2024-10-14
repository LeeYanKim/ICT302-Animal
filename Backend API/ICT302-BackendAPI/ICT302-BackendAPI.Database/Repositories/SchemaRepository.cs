// SchemaRepository.cs
using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<IEnumerable<Animal>> GetAnimalsAsync()
        {
<<<<<<< Updated upstream
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
=======
            return await _ctx.Animals.Include(a => a.Graphics).ToListAsync();
        }

        public async Task<Animal> GetAnimalByIDAsync(Guid id)
        {
            return await _ctx.Animals.Include(a => a.Graphics).FirstOrDefaultAsync(a => a.AnimalID == id);
>>>>>>> Stashed changes
        }

        public async Task<Animal> CreateAnimalAsync(Animal animal)
        {
            _ctx.Animals.Add(animal);
            await _ctx.SaveChangesAsync();
            return animal;
        }

        public async Task<int> DeleteAnimalAsync(Animal animal)
        {
            _ctx.Animals.Remove(animal);
            return await _ctx.SaveChangesAsync();
        }

        public async Task<Animal> UpdateAnimalAsync(Animal animal)
        {
            _ctx.Animals.Update(animal);
            await _ctx.SaveChangesAsync();
            return animal;
        }

<<<<<<< Updated upstream
        // Delete an animal
        public async Task<int> DeleteAnimalAsync(Animal animal)
        {
            _ctx.Animals.Remove(animal);
            return await _ctx.SaveChangesAsync();
=======
        public async Task<Animal> UpdateAnimalVideoDataAsync(Guid animalId, string videoFileName, DateTime uploadDate)
        {
            var animal = await _ctx.Animals.FindAsync(animalId);
            if (animal == null) return null;

            var graphic = new Graphic
            {
                GPCID = Guid.NewGuid(),
                GPCName = videoFileName,
                GPCDateUpload = uploadDate,
                AnimalID = animal.AnimalID
            };

            _ctx.Graphics.Add(graphic);
            await _ctx.SaveChangesAsync();

            return animal;
        }

        // New method to get animal by name and DOB
        public async Task<Animal> GetAnimalByNameAndDOBAsync(string name, DateTime dob)
        {
            return await _ctx.Animals
                .Include(a => a.Graphics)
                .FirstOrDefaultAsync(a => a.AnimalName == name && a.AnimalDOB == dob);
>>>>>>> Stashed changes
        }
    }
}
