using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class OrganisationAccessRepository : IOrganisationAccessRepository
    {
        private readonly SchemaContext _ctx;

        public OrganisationAccessRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<OrganisationAccess>> GetOrganisationAccessesAsync()
        {
            var organisationAccesses = await _ctx.OrganisationAccesses.ToListAsync();
            return organisationAccesses;
        }

        public async Task<OrganisationAccess?> GetOrganisationAccessByIDAsync(Guid id)
        {
            var organisationAccess = await _ctx.OrganisationAccesses.FindAsync(id);
            return organisationAccess;
        }

        public async Task<OrganisationAccess> CreateOrganisationAccessAsync(OrganisationAccess organisationAccess)
        {
            _ctx.OrganisationAccesses.Attach(organisationAccess);
            _ctx.OrganisationAccesses.Add(organisationAccess);
            await _ctx.SaveChangesAsync();
            return organisationAccess;
        }

        public async Task<OrganisationAccess> UpdateOrganisationAccessAsync(OrganisationAccess organisationAccess)
        {
            _ctx.OrganisationAccesses.Update(organisationAccess);
            await _ctx.SaveChangesAsync();
            return organisationAccess;
        }

        public async Task<int> DeleteOrganisationAccessAsync(OrganisationAccess organisationAccess)
        {
            _ctx.OrganisationAccesses.Remove(organisationAccess);
            return await _ctx.SaveChangesAsync();
        }
    }
}
