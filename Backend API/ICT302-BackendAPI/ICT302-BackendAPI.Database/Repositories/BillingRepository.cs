using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class BillingRepository : IBillingRepository
    {
        private readonly SchemaContext _ctx;

        public BillingRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<Billing>> GetBillingsAsync()
        {
            var billings = await _ctx.Billings.ToListAsync();
            billings.ForEach(a => _ctx.Billings.Attach(a));
            return billings;
        }

        public async Task<Billing?> GetBillingByIDAsync(Guid id)
        {
            var billing = await _ctx.Billings.FindAsync(id);
            return billing;
        }

        public async Task<Billing> CreateBillingAsync(Billing billing)
        {
            _ctx.Billings.Attach(billing);
            _ctx.Billings.Add(billing);
            await _ctx.SaveChangesAsync();
            return billing;
        }

        public async Task<Billing> UpdateBillingAsync(Billing billing)
        {
            _ctx.Billings.Update(billing);
            await _ctx.SaveChangesAsync();
            return billing;
        }

        public async Task<int> DeleteBillingAsync(Billing billing)
        {
            _ctx.Billings.Remove(billing);
            return await _ctx.SaveChangesAsync();
        }
    }
}
