using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IUserRepository
    {
        Task<User> CreateUserAsync(User user);
        Task<int> DeleteUserAsync(User user);
        Task<User?> GetUserByIDAsync(Guid id);
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> UpdateUserAsync(User user);

        Task<Subscription?> GetSubscriptionByIDAsync(Guid id);
    }
}