using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class UserAccessRepository(SchemaContext ctx) : IUserAccessRepository
    {
        public async Task<IEnumerable<UserAccess>?> GetUserAccessesAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var userAccesses = await ctx.UserAccess.ToListAsync();
            userAccesses.ForEach(a => ctx.UserAccess.Attach(a));
            return userAccesses;
        }

        public async Task<UserAccess?> GetUserAccessByKeysAsync(Guid orgId, Guid userId)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var userAccess = await ctx.UserAccess.FindAsync(orgId, userId);
            return userAccess;
        }

        public async Task<UserAccess?> CreateUserAccessAsync(UserAccess userAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.UserAccess.Attach(userAccess);
            ctx.UserAccess.Add(userAccess);
            await ctx.SaveChangesAsync();
            return userAccess;
        }

        public async Task<UserAccess?> UpdateUserAccessAsync(UserAccess userAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.UserAccess.Update(userAccess);
            await ctx.SaveChangesAsync();
            return userAccess;
        }

        public async Task<int?> DeleteUserAccessAsync(UserAccess userAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.UserAccess.Remove(userAccess);
            return await ctx.SaveChangesAsync();
        }
    }
}
