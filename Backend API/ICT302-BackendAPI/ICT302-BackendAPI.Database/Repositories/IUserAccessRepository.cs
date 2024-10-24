using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IUserAccessRepository
    {
        Task<UserAccess?> CreateUserAccessAsync(UserAccess userAccess);
        Task<int?> DeleteUserAccessAsync(UserAccess userAccess);
        Task<UserAccess?> GetUserAccessByKeysAsync(Guid orgId, Guid userId);
        Task<IEnumerable<UserAccess>?> GetUserAccessesAsync();
        Task<UserAccess?> UpdateUserAccessAsync(UserAccess userAccess);
    }
}
