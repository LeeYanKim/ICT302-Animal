using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class OrganisationRepository(SchemaContext ctx) : IOrganisationRepository
    {
        public async Task<IEnumerable<Organisation>?> GetOrganisationsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var organisations = await ctx.Organisations.ToListAsync();
            organisations.ForEach(a => ctx.Organisations.Attach(a));
            return organisations;
        }

        public async Task<Organisation?> GetOrganisationByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var organisation = await ctx.Organisations.FindAsync(id);
            return organisation;
        }

        public async Task<Organisation?> CreateOrganisationAsync(Organisation organisation)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Organisations.Attach(organisation);
            ctx.Organisations.Add(organisation);
            await ctx.SaveChangesAsync();
            return organisation;
        }

        public async Task<Organisation?> UpdateOrganisationAsync(Organisation organisation)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.Organisations.Update(organisation);
            await ctx.SaveChangesAsync();
            return organisation;
        }

        public async Task<int?> DeleteOrganisationAsync(Organisation organisation)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Organisations.Remove(organisation);
            return await ctx.SaveChangesAsync();
        }
    }
}
