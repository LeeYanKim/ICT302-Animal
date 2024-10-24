using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class UserRepository(SchemaContext ctx, ILogger<UserRepository> logger) : IUserRepository
    {
        public async Task<IEnumerable<User>?> GetUsersAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var users = await ctx.Users.ToListAsync();
            users.ForEach(a => ctx.Users.Attach(a));
            return users;
        }

        public async Task<User?> GetUserByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var user = await ctx.Users.FindAsync(id);
            return user;
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Users.Attach(user);
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();
            return user;
        }

        public async Task<User?> UpdateUserAsync(User user)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Users.Update(user);
            await ctx.SaveChangesAsync();
            return user;
        }

        public async Task<int?> DeleteUserAsync(User user)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Users.Remove(user);
            return await ctx.SaveChangesAsync();
        }
        
        public async Task<Subscription?> GetSubscriptionByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var subscription = await ctx.Subscriptions.FindAsync(id);

            if (subscription == null)
            {
                logger.LogWarning("No subscription found with ID {id}", id);
            }
            else
            {
                logger.LogInformation("Found subscription: {title}", subscription.SubscriptionTitle);
            }

            return subscription;
        }

        public async Task<Subscription?> GetDefaultSubscriptionAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var subs = await ctx.Subscriptions.ToListAsync();
            if (subs.Count == 0)
                return null;
            
            return subs.FirstOrDefault();
        }
        
        public async Task<string?> GetEmailByIDAsync(Guid userID)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var user = await ctx.Users.FindAsync(userID);
            return user?.UserEmail; // Return null if the user is not found
        }
    }
}