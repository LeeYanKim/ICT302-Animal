// GraphicRepository.cs
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
            return await _ctx.Graphics.ToListAsync();
        }

        public async Task<Graphic> GetGraphicByIDAsync(Guid id)
        {
            return await _ctx.Graphics.FindAsync(id);
        }

        public async Task<Graphic> CreateGraphicAsync(Graphic graphic)
        {
            _ctx.Graphics.Add(graphic);
            await _ctx.SaveChangesAsync();
            return graphic;
        }

        public async Task<int> DeleteGraphicAsync(Graphic graphic)
        {
            _ctx.Graphics.Remove(graphic);
            return await _ctx.SaveChangesAsync();
        }

        // Implement the missing method
        public async Task<Graphic> UpdateGraphicAsync(Graphic graphic)
        {
            _ctx.Graphics.Update(graphic);
            await _ctx.SaveChangesAsync();
            return graphic;
        }
<<<<<<< Updated upstream

        public async Task<int> DeleteGraphicAsync(Graphic graphic)
        {
            _ctx.Graphics.Remove(graphic);
            return await _ctx.SaveChangesAsync();
        }
        
=======
>>>>>>> Stashed changes
    }
}
