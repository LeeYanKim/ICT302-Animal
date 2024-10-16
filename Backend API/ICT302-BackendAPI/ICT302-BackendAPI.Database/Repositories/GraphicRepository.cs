using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class GraphicRepository : IGraphicRepository
    {
        private readonly SchemaContext _ctx;

        public GraphicRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<Graphic>> GetGraphicsAsync()
        {
            var graphics = await _ctx.Graphics.ToListAsync();
            return graphics;
        }

        public async Task<Graphic> CreateGraphicAsync(Graphic graphic)
        {
            _ctx.Graphics.Attach(graphic);
            _ctx.Graphics.Add(graphic);
            await _ctx.SaveChangesAsync();
            return graphic;
        }

        public async Task<Graphic> UpdateGraphicAsync(Graphic graphic)
        {
            _ctx.Graphics.Update(graphic);
            await _ctx.SaveChangesAsync();
            return graphic;
        }

        public async Task<Graphic?> GetGraphicByIDAsync(Guid? id)
        {
            if(id == null) return null;
            
            var graphic = await _ctx.Graphics.FindAsync(id);
            if(graphic != null)
                _ctx.Graphics.Attach(graphic);
            return graphic;
        }

        public async Task<Graphic?> GetGraphicByFileNameAsync(string fileName)
        {
            var graphics = await _ctx.Graphics.ToListAsync();
            var graphic = graphics.Find(fn => fn.FilePath == fileName);
            
            if(graphic != null)
                _ctx.Graphics.Attach(graphic);
            return graphic;
        }

        public async Task<int> DeleteGraphicAsync(Graphic graphic)
        {
            _ctx.Graphics.Remove(graphic);
            return await _ctx.SaveChangesAsync();
        }
    }
}
