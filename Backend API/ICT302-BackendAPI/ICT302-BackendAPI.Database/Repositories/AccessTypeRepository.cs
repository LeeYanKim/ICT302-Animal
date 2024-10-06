using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class AccessTypeRepository : IAccessTypeRepository
    {
        private readonly SchemaContext _ctx;

        public AccessTypeRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<AccessType>> GetAccessTypesAsync()
        {
            return await _ctx.AccessTypes.ToListAsync();
        }

        public async Task<AccessType> GetAccessTypeByIDAsync(Guid id)
        {
            return await _ctx.AccessTypes.FindAsync(id);
        }

        public async Task<AccessType> CreateAccessTypeAsync(AccessType accessType)
        {
            _ctx.AccessTypes.Add(accessType);
            await _ctx.SaveChangesAsync();
            return accessType;
        }

        public async Task<AccessType> UpdateAccessTypeAsync(AccessType accessType)
        {
            _ctx.AccessTypes.Update(accessType);
            await _ctx.SaveChangesAsync();
            return accessType;
        }

        public async Task<int> DeleteAccessTypeAsync(AccessType accessType)
        {
            _ctx.AccessTypes.Remove(accessType);
            return await _ctx.SaveChangesAsync();
        }
    }
}
