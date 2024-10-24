using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IAccessTypeRepository
    {
        Task<AccessType?> CreateAccessTypeAsync(AccessType accessType);
        Task<int?> DeleteAccessTypeAsync(AccessType accessType);
        Task<AccessType?> GetAccessTypeByIDAsync(Guid id);
        Task<IEnumerable<AccessType>?> GetAccessTypesAsync();
        Task<AccessType?> UpdateAccessTypeAsync(AccessType accessType);
    }
}
