using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class OrgRequestsRepository : IOrgRequestsRepository
    {
        private readonly SchemaContext _ctx;

        public OrgRequestsRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<OrgRequests>> GetOrgRequestsAsync()
        {
            var orgRequests = await _ctx.OrgRequests.ToListAsync();
            return orgRequests;
        }

        public async Task<OrgRequests> GetOrgRequestsByIDAsync(Guid id)
        {
            var orgRequest = await _ctx.OrgRequests.FindAsync(id);
            return orgRequest;
        }

        public async Task<OrgRequests> CreateOrgRequestsAsync(OrgRequests orgRequests)
        {
            _ctx.OrgRequests.Add(orgRequests);
            await _ctx.SaveChangesAsync();
            return orgRequests;
        }

        public async Task<OrgRequests> UpdateOrgRequestsAsync(OrgRequests orgRequests)
        {
            _ctx.OrgRequests.Update(orgRequests);
            await _ctx.SaveChangesAsync();
            return orgRequests;
        }

        public async Task<int> DeleteOrgRequestsAsync(OrgRequests orgRequests)
        {
            _ctx.OrgRequests.Remove(orgRequests);
            return await _ctx.SaveChangesAsync();
        }
    }
}
