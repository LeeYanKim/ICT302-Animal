using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IAnimalAccessRepository
    {
        Task<AnimalAccess?> CreateAnimalAccessAsync(AnimalAccess animalAccess);
        Task<int?> DeleteAnimalAccessAsync(AnimalAccess animalAccess);
        Task<AnimalAccess?> GetAnimalAccessByIDAsync(Guid id);
        Task<IEnumerable<AnimalAccess>?> GetAnimalAccessesAsync();
        Task<AnimalAccess?> UpdateAnimalAccessAsync(AnimalAccess animalAccess);
        Task<IEnumerable<Guid>?> GetAnimalIDsByUserIDAsync(Guid userID);
    }
}
