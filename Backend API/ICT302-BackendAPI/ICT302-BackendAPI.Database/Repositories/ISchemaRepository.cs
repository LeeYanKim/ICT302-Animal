// ISchemaRepository.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface ISchemaRepository
    {
        Task<IEnumerable<Animal>> GetAnimalsAsync();
        Task<Animal> GetAnimalByIDAsync(Guid id);
        Task<Animal> GetAnimalByNameAndDOBAsync(string name, DateTime dob);
        Task<Animal> CreateAnimalAsync(Animal animal);
        Task<Animal> UpdateAnimalAsync(Animal animal);
        Task<int> DeleteAnimalAsync(Animal animal);
    }
}
