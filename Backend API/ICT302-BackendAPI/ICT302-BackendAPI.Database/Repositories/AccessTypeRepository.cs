using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class AccessTypeRepository(SchemaContext ctx) : IAccessTypeRepository
    {
        public async Task<IEnumerable<AccessType>?> GetAccessTypesAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            var at =  await ctx.AccessTypes.ToListAsync();
            at.ForEach(a => ctx.AccessTypes.Attach(a));
            return at;
        }

        public async Task<AccessType?> GetAccessTypeByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            return await ctx.AccessTypes.FindAsync(id);
        }

        public async Task<AccessType?> CreateAccessTypeAsync(AccessType accessType)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.AccessTypes.Attach(accessType);
            ctx.AccessTypes.Add(accessType);
            await ctx.SaveChangesAsync();
            return accessType;
        }

        public async Task<AccessType?> UpdateAccessTypeAsync(AccessType accessType)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.AccessTypes.Attach(accessType);
            ctx.AccessTypes.Update(accessType);
            await ctx.SaveChangesAsync();
            return accessType;
        }

        public async Task<int?> DeleteAccessTypeAsync(AccessType accessType)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.AccessTypes.Remove(accessType);
            return await ctx.SaveChangesAsync();
        }
    }
}
