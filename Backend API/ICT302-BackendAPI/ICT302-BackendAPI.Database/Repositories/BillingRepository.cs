using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class BillingRepository(SchemaContext ctx) : IBillingRepository
    {
        public async Task<IEnumerable<Billing>?> GetBillingsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var billings = await ctx.Billings.ToListAsync();
            billings.ForEach(a => ctx.Billings.Attach(a));
            return billings;
        }

        public async Task<Billing?> GetBillingByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var billing = await ctx.Billings.FindAsync(id);
            return billing;
        }

        public async Task<Billing?> CreateBillingAsync(Billing billing)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Billings.Attach(billing);
            ctx.Billings.Add(billing);
            await ctx.SaveChangesAsync();
            return billing;
        }

        public async Task<Billing?> UpdateBillingAsync(Billing billing)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Billings.Update(billing);
            await ctx.SaveChangesAsync();
            return billing;
        }

        public async Task<int?> DeleteBillingAsync(Billing billing)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Billings.Remove(billing);
            return await ctx.SaveChangesAsync();
        }
    }
}
