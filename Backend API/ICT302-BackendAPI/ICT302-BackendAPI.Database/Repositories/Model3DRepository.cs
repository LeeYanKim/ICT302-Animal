using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class Model3DRepository(SchemaContext ctx) : IModel3DRepository
    {
        public async Task<IEnumerable<Model3D>?> GetModel3DsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var models = await ctx.Model3D.ToListAsync();
            models.ForEach(a => ctx.Model3D.Attach(a));
            return models;
        }

        public async Task<Model3D?> GetModel3DFromGraphicsIdAsync(Guid graphicsId)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var models = await ctx.Model3D.ToListAsync();
            var model = models.Find(m => m.GPCID == graphicsId) ?? null;
            return model;
        }

        public async Task<List<Model3D>?> GetModel3DListFromAnimalIdAsync(Guid animalId)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var models = await ctx.Model3D.ToListAsync();
            var graphics = await ctx.Graphics.ToListAsync();
            var animalsGraphics = graphics.Where(g => g.AnimalID == animalId);
            
            var animalsModels = new List<Model3D>();
            foreach (var g in animalsGraphics)
            {
                var model = models.Find(m => m.GPCID == g.GPCID);
                if (model != null)
                    animalsModels.Add(model);
            }
            return animalsModels;
        }

        public async Task<Model3D?> GetModel3DByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var model = await ctx.Model3D.FindAsync(id);
            if(model != null)
                ctx.Model3D.Attach(model);
            return model;
        }

        public async Task<Model3D?> CreateModel3DAsync(Model3D model3D)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Model3D.Attach(model3D);
            ctx.Model3D.Add(model3D);
            await ctx.SaveChangesAsync();
            return model3D;
        }

        public async Task<Model3D?> UpdateModel3DAsync(Model3D model3D)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Model3D.Update(model3D);
            await ctx.SaveChangesAsync();
            return model3D;
        }

        public async Task<int?> DeleteModel3DAsync(Model3D model3D)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Model3D.Remove(model3D);
            return await ctx.SaveChangesAsync();
        }
    }
}
