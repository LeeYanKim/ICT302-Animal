using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly SchemaContext _ctx;

        public UserRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            var users = await _ctx.Users.ToListAsync();
            return users;
        }

        public async Task<User?> GetUserByIDAsync(Guid id)
        {
            var user = await _ctx.Users.FindAsync(id);
            return user;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _ctx.Users.Attach(user);
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            _ctx.Users.Update(user);
            await _ctx.SaveChangesAsync();
            return user;
        }

        public async Task<int> DeleteUserAsync(User user)
        {
            _ctx.Users.Remove(user);
            return await _ctx.SaveChangesAsync();
        }

        public async Task<Subscription?> GetSubscriptionByIDAsync(Guid id)
        {
            var subscription = await _ctx.Subscriptions.FindAsync(id);
            return subscription;
        }
    }
}