using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IBillingRepository
    {
        Task<Billing> CreateBillingAsync(Billing billing);
        Task<int> DeleteBillingAsync(Billing billing);
        Task<Billing> GetBillingByIDAsync(Guid id);
        Task<IEnumerable<Billing>> GetBillingsAsync();
        Task<Billing> UpdateBillingAsync(Billing billing);
    }
}
