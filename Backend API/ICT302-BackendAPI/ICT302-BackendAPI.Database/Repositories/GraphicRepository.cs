// GraphicRepository.cs
using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class GraphicRepository(SchemaContext ctx) : IGraphicRepository
    {
        public async Task<IEnumerable<Graphic>?> GetGraphicsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var graphics = await ctx.Graphics.ToListAsync();
            graphics.ForEach(a => ctx.Graphics.Attach(a));
            return graphics;
        }

        public async Task<Graphic?> CreateGraphicAsync(Graphic graphic)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Graphics.Attach(graphic);
            ctx.Graphics.Add(graphic);
            await ctx.SaveChangesAsync();
            return graphic;
        }

        public async Task<Graphic?> UpdateGraphicAsync(Graphic graphic)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Graphics.Update(graphic);
            await ctx.SaveChangesAsync();
            return graphic;
        }

        public async Task<Graphic?> GetGraphicByIDAsync(Guid? id)
        {
            if(id == null) return null;
            
            if (!await ctx.CheckDbIsAvailable())
                return null;

            
            var graphic = await ctx.Graphics.FindAsync(id);
            if(graphic != null)
                ctx.Graphics.Attach(graphic);
            return graphic;
        }

        public async Task<Graphic?> GetGraphicByFileNameAsync(string fileName)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var graphics = await ctx.Graphics.ToListAsync();
            var graphic = graphics.Find(fn => fn.FilePath == fileName);
            
            if(graphic != null)
                ctx.Graphics.Attach(graphic);
            return graphic;
        }

        public async Task<int?> DeleteGraphicAsync(Graphic graphic)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Graphics.Remove(graphic);
            return await ctx.SaveChangesAsync();
        }
        
    }
}