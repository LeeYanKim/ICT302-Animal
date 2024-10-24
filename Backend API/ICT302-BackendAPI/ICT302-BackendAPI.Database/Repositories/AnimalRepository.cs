using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class AnimalRepository(SchemaContext ctx) : IAnimalRepository
    {
        // Get all animals
        public async Task<IEnumerable<Animal>?> GetAnimalsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            var animals = await ctx.Animals.ToListAsync();
            animals.ForEach(a => ctx.Animals.Attach(a));
            return animals;

        }

        // Get animal by ID
        public async Task<Animal?> GetAnimalByIdAsync(Guid? id)
        {
            if (id == null) return null;

            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            // Use Include to eagerly load the related Graphics data
            var animal = await ctx.Animals
                .Include(a => a.Graphics)
                .FirstOrDefaultAsync(a => a.AnimalID == id); // Use FirstOrDefaultAsync instead of FindAsync to support Include

            if (animal != null)
            { 
                ctx.Animals.Attach(animal); // Attach the entity to the context
            }

            return animal;

        }


        // Create a new animal
        public async Task<Animal?> CreateAnimalAsync(Animal animal)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.Animals.Attach(animal);
            ctx.Animals.Add(animal);
            await ctx.SaveChangesAsync();
            return animal;
            
        }

        // Update an existing animal
        public async Task<Animal?> UpdateAnimalAsync(Animal animal)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.Animals.Attach(animal);
            ctx.Animals.Update(animal);
            await ctx.SaveChangesAsync();
            return animal;

        }

        // Delete an animal
        public async Task<int?> DeleteAnimalAsync(Animal animal)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.Animals.Remove(animal);
            return await ctx.SaveChangesAsync();

        }

        // Update animal video data
        public async Task<Animal?> UpdateAnimalVideoDataAsync(Guid animalId, string videoFileName, DateTime uploadDate)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            var animal = await ctx.Animals.FindAsync(animalId);
            if (animal == null)
            {
                return null; // Animal not found
            }


            ctx.Animals.Update(animal);
            await ctx.SaveChangesAsync();

            return animal;
            

            
        }
    }
}
