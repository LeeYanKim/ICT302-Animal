using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class AnimalAccessRepository : IAnimalAccessRepository
    {
        private readonly SchemaContext _ctx;

        public AnimalAccessRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<AnimalAccess>> GetAnimalAccessesAsync()
        {
            var animalAccesses = await _ctx.AnimalAccesses.ToListAsync();
            return animalAccesses;
        }

        public async Task<AnimalAccess> GetAnimalAccessByIDAsync(Guid id)
        {
            var animalAccess = await _ctx.AnimalAccesses.FindAsync(id);
            return animalAccess;
        }

        public async Task<AnimalAccess> CreateAnimalAccessAsync(AnimalAccess animalAccess)
        {
            _ctx.AnimalAccesses.Add(animalAccess);
            await _ctx.SaveChangesAsync();
            return animalAccess;
        }

        public async Task<AnimalAccess> UpdateAnimalAccessAsync(AnimalAccess animalAccess)
        {
            _ctx.AnimalAccesses.Update(animalAccess);
            await _ctx.SaveChangesAsync();
            return animalAccess;
        }

        public async Task<int> DeleteAnimalAccessAsync(AnimalAccess animalAccess)
        {
            _ctx.AnimalAccesses.Remove(animalAccess);
            return await _ctx.SaveChangesAsync();
        }
    }
}
