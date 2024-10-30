using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class OrgRequestsRepository(SchemaContext ctx) : IOrgRequestsRepository
    {
        public async Task<IEnumerable<OrgRequests>?> GetOrgRequestsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var orgRequests = await ctx.OrgRequests.ToListAsync();
            orgRequests.ForEach(a => ctx.OrgRequests.Attach(a));
            return orgRequests;
        }

        public async Task<OrgRequests?> GetOrgRequestsByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var orgRequest = await ctx.OrgRequests.FindAsync(id);
            return orgRequest;
        }

        public async Task<OrgRequests?> CreateOrgRequestsAsync(OrgRequests orgRequests)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.OrgRequests.Attach(orgRequests);
            ctx.OrgRequests.Add(orgRequests);
            await ctx.SaveChangesAsync();
            return orgRequests;
        }

        public async Task<OrgRequests?> UpdateOrgRequestsAsync(OrgRequests orgRequests)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.OrgRequests.Update(orgRequests);
            await ctx.SaveChangesAsync();
            return orgRequests;
        }

        public async Task<int?> DeleteOrgRequestsAsync(OrgRequests orgRequests)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.OrgRequests.Remove(orgRequests);
            return await ctx.SaveChangesAsync();
        }
    }
}
