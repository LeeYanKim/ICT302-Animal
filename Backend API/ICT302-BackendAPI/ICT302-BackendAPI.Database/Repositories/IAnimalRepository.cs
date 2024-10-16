using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IAnimalRepository
    {
        Task<Animal> CreateAnimalAsync(Animal animal);
        Task<int> DeleteAnimalAsync(Animal animal);
        Task<Animal?> GetAnimalByIDAsync(Guid? id);
        Task<IEnumerable<Animal>> GetAnimalsAsync();
        Task<Animal> UpdateAnimalAsync(Animal animal);
         Task<Animal?> UpdateAnimalVideoDataAsync(Guid animalId, string videoFileName, DateTime uploadDate);
    }
}