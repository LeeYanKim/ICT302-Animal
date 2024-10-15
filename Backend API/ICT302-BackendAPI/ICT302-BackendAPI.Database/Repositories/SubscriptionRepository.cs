using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class SubscriptionRepository : ISubscriptionRepository
    {
        private readonly SchemaContext _ctx;

        public SubscriptionRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<Subscription>> GetSubscriptionsAsync()
        {
            var subscriptions = await _ctx.Subscriptions.ToListAsync();
            return subscriptions;
        }

        public async Task<Subscription?> GetSubscriptionByIDAsync(Guid id)
        {
            var subscription = await _ctx.Subscriptions.FindAsync(id);
            return subscription;
        }

        public async Task<Subscription> CreateSubscriptionAsync(Subscription subscription)
        {
            _ctx.Subscriptions.Attach(subscription);
            _ctx.Subscriptions.Add(subscription);
            await _ctx.SaveChangesAsync();
            return subscription;
        }

        public async Task<Subscription> UpdateSubscriptionAsync(Subscription subscription)
        {
            _ctx.Subscriptions.Update(subscription);
            await _ctx.SaveChangesAsync();
            return subscription;
        }

        public async Task<int> DeleteSubscriptionAsync(Subscription subscription)
        {
            _ctx.Subscriptions.Remove(subscription);
            return await _ctx.SaveChangesAsync();
        }
    }
}
