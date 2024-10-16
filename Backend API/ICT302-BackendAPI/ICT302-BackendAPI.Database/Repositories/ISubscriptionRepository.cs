using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface ISubscriptionRepository
    {
        Task<Subscription> CreateSubscriptionAsync(Subscription subscription);
        Task<int> DeleteSubscriptionAsync(Subscription subscription);
        Task<Subscription?> GetSubscriptionByIDAsync(Guid id);
        Task<IEnumerable<Subscription>> GetSubscriptionsAsync();
        Task<Subscription> UpdateSubscriptionAsync(Subscription subscription);
    }
}
