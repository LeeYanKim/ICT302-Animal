using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IGraphicRepository
    {
        Task<Graphic> CreateGraphicAsync(Graphic graphic);
        Task<int> DeleteGraphicAsync(Graphic graphic);
        Task<Graphic?> GetGraphicByIDAsync(Guid id);
        Task<IEnumerable<Graphic>> GetGraphicsAsync();
        Task<Graphic> UpdateGraphicAsync(Graphic graphic);
    }
}
