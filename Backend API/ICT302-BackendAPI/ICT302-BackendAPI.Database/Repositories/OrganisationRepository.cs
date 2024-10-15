using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class OrganisationRepository : IOrganisationRepository
    {
        private readonly SchemaContext _ctx;

        public OrganisationRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<Organisation>> GetOrganisationsAsync()
        {
            var organisations = await _ctx.Organisations.ToListAsync();
            return organisations;
        }

        public async Task<Organisation?> GetOrganisationByIDAsync(Guid id)
        {
            var organisation = await _ctx.Organisations.FindAsync(id);
            return organisation;
        }

        public async Task<Organisation> CreateOrganisationAsync(Organisation organisation)
        {
            _ctx.Organisations.Attach(organisation);
            _ctx.Organisations.Add(organisation);
            await _ctx.SaveChangesAsync();
            return organisation;
        }

        public async Task<Organisation> UpdateOrganisationAsync(Organisation organisation)
        {
            _ctx.Organisations.Update(organisation);
            await _ctx.SaveChangesAsync();
            return organisation;
        }

        public async Task<int> DeleteOrganisationAsync(Organisation organisation)
        {
            _ctx.Organisations.Remove(organisation);
            return await _ctx.SaveChangesAsync();
        }
    }
}
