using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class OrganisationAccessRepository(SchemaContext ctx) : IOrganisationAccessRepository
    {
        public async Task<IEnumerable<OrganisationAccess>?> GetOrganisationAccessesAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var organisationAccesses = await ctx.OrganisationAccesses.ToListAsync();
            organisationAccesses.ForEach(a => ctx.OrganisationAccesses.Attach(a));
            return organisationAccesses;
        }

        public async Task<OrganisationAccess?> GetOrganisationAccessByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var organisationAccess = await ctx.OrganisationAccesses.FindAsync(id);
            return organisationAccess;
        }

        public async Task<OrganisationAccess?> CreateOrganisationAccessAsync(OrganisationAccess organisationAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.OrganisationAccesses.Attach(organisationAccess);
            ctx.OrganisationAccesses.Add(organisationAccess);
            await ctx.SaveChangesAsync();
            return organisationAccess;
        }

        public async Task<OrganisationAccess?> UpdateOrganisationAccessAsync(OrganisationAccess organisationAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.OrganisationAccesses.Update(organisationAccess);
            await ctx.SaveChangesAsync();
            return organisationAccess;
        }

        public async Task<int?> DeleteOrganisationAccessAsync(OrganisationAccess organisationAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.OrganisationAccesses.Remove(organisationAccess);
            return await ctx.SaveChangesAsync();
        }
    }
}
