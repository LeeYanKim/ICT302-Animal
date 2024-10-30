using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class SubscriptionRepository(SchemaContext ctx) : ISubscriptionRepository
    {
        public async Task<IEnumerable<Subscription>?> GetSubscriptionsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var subscriptions = await ctx.Subscriptions.ToListAsync();
            subscriptions.ForEach(a => ctx.Subscriptions.Attach(a));
            return subscriptions;
        }

        public async Task<Subscription?> GetSubscriptionByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var subscription = await ctx.Subscriptions.FindAsync(id);
            return subscription;
        }

        public async Task<Subscription?> CreateSubscriptionAsync(Subscription subscription)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Subscriptions.Attach(subscription);
            ctx.Subscriptions.Add(subscription);
            await ctx.SaveChangesAsync();
            return subscription;
        }

        public async Task<Subscription?> UpdateSubscriptionAsync(Subscription subscription)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Subscriptions.Update(subscription);
            await ctx.SaveChangesAsync();
            return subscription;
        }

        public async Task<int?> DeleteSubscriptionAsync(Subscription subscription)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Subscriptions.Remove(subscription);
            return await ctx.SaveChangesAsync();
        }
    }
}
