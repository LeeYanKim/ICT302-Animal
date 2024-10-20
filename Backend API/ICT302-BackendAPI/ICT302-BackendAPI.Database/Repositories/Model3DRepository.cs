using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class Model3DRepository : IModel3DRepository
    {
        private readonly SchemaContext _ctx;

        public Model3DRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<Model3D>> GetModel3DsAsync()
        {
            var models = await _ctx.Model3D.ToListAsync();
            models.ForEach(a => _ctx.Model3D.Attach(a));
            return models;
        }

        public async Task<Model3D?> GetModel3DByIDAsync(Guid id)
        {
            var model = await _ctx.Model3D.FindAsync(id);
            if(model != null)
                _ctx.Model3D.Attach(model);
            return model;
        }

        public async Task<Model3D> CreateModel3DAsync(Model3D model3D)
        {
            _ctx.Model3D.Attach(model3D);
            _ctx.Model3D.Add(model3D);
            await _ctx.SaveChangesAsync();
            return model3D;
        }

        public async Task<Model3D> UpdateModel3DAsync(Model3D model3D)
        {
            _ctx.Model3D.Update(model3D);
            await _ctx.SaveChangesAsync();
            return model3D;
        }

        public async Task<int> DeleteModel3DAsync(Model3D model3D)
        {
            _ctx.Model3D.Remove(model3D);
            return await _ctx.SaveChangesAsync();
        }
    }
}
