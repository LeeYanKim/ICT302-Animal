using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class UserAccessRepository : IUserAccessRepository
    {
        private readonly SchemaContext _ctx;

        public UserAccessRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<UserAccess>> GetUserAccessesAsync()
        {
            var userAccesses = await _ctx.UserAccesses.ToListAsync();
            return userAccesses;
        }

        public async Task<UserAccess> GetUserAccessByKeysAsync(Guid orgId, Guid userId)
        {
            var userAccess = await _ctx.UserAccesses.FindAsync(orgId, userId);
            return userAccess;
        }

        public async Task<UserAccess> CreateUserAccessAsync(UserAccess userAccess)
        {
            _ctx.UserAccesses.Add(userAccess);
            await _ctx.SaveChangesAsync();
            return userAccess;
        }

        public async Task<UserAccess> UpdateUserAccessAsync(UserAccess userAccess)
        {
            _ctx.UserAccesses.Update(userAccess);
            await _ctx.SaveChangesAsync();
            return userAccess;
        }

        public async Task<int> DeleteUserAccessAsync(UserAccess userAccess)
        {
            _ctx.UserAccesses.Remove(userAccess);
            return await _ctx.SaveChangesAsync();
        }
    }
}
