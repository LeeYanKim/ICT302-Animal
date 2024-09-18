using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace ICT302_BackendAPI.Database.Repositories;

public class SchemaRepository : ISchemaRepository
{
    private readonly SchemaContext _ctx;

    public SchemaRepository(SchemaContext ctx)
    {
        _ctx = ctx;
    }

    //This is a test to get animals from the db
    public async Task<IEnumerable<Animal>> GetAnimalsAsync()
    {
        var animals = await _ctx.Animals.ToListAsync();
        return animals;
    }

    public async Task<Animal> GetAnimalByIDAsync(Guid id)
    {
        var animal = await _ctx.Animals.FindAsync(id);
        return animal;
    }

    public async Task<Animal> CreateAnimalAsync(Animal animal)
    {
        _ctx.Animals.Add(animal);
        await _ctx.SaveChangesAsync();
        return animal;
    }

    public async Task<Animal> UpdateAnimalAsync(Animal animal)
    {
        _ctx.Animals.Update(animal);
        await _ctx.SaveChangesAsync();
        return animal;
    }

    public async Task<int> DeleteAnimalAsync(Animal animal)
    {
        _ctx.Animals.Remove(animal);
        return await _ctx.SaveChangesAsync();
    }
}
