// ISchemaRepository.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface ISchemaRepository
    {
        Task<IEnumerable<Animal>> GetAnimalsAsync();
        Task<Animal> GetAnimalByIDAsync(Guid id);
        Task<Animal> GetAnimalByNameAndDOBAsync(string name, DateTime dob);
        Task<Animal> CreateAnimalAsync(Animal animal);
        Task<Animal> UpdateAnimalAsync(Animal animal);
<<<<<<< Updated upstream
        Task<int> DeleteAnimalAsync(Animal animal);
=======
        Task<Animal> UpdateAnimalVideoDataAsync(Guid animalId, string videoFileName, DateTime uploadDate);
        
        // New method to retrieve animal by name and date of birth
        Task<Animal> GetAnimalByNameAndDOBAsync(string name, DateTime dob);
>>>>>>> Stashed changes
    }
}
