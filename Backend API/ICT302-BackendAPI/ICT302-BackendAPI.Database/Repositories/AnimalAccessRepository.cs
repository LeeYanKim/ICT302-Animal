using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class AnimalAccessRepository(SchemaContext ctx) : IAnimalAccessRepository
    {
        public async Task<IEnumerable<AnimalAccess>?> GetAnimalAccessesAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            var animalAccesses = await ctx.AnimalAccesses.ToListAsync();
            animalAccesses.ForEach(a => ctx.AnimalAccesses.Attach(a));
            return animalAccesses;
        }

        public async Task<AnimalAccess?> GetAnimalAccessByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var animalAccess = await ctx.AnimalAccesses.FindAsync(id);
            return animalAccess;
        }

        public async Task<AnimalAccess?> CreateAnimalAccessAsync(AnimalAccess animalAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.AnimalAccesses.Attach(animalAccess);
            ctx.AnimalAccesses.Add(animalAccess);
            await ctx.SaveChangesAsync();
            return animalAccess;
        }

        public async Task<AnimalAccess?> UpdateAnimalAccessAsync(AnimalAccess animalAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.AnimalAccesses.Attach(animalAccess);
            ctx.AnimalAccesses.Update(animalAccess);
            await ctx.SaveChangesAsync();
            return animalAccess;
        }

        public async Task<int?> DeleteAnimalAccessAsync(AnimalAccess animalAccess)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.AnimalAccesses.Remove(animalAccess);
            return await ctx.SaveChangesAsync();
        }

        public async Task<IEnumerable<Guid>?> GetAnimalIDsByUserIDAsync(Guid userId)
        {
            
            if (!await ctx.CheckDbIsAvailable())
                return null;

            return await ctx.AnimalAccesses
                .Where(a => a.UserID == userId)
                .Select(a => a.AnimalID)
                .ToListAsync();
        }
    }
}
