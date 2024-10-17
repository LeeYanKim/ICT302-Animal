// IGraphicRepository.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IGraphicRepository
    {
        Task<IEnumerable<Graphic>> GetGraphicsAsync();
        Task<Graphic> GetGraphicByIDAsync(Guid id);
        Task<Graphic> CreateGraphicAsync(Graphic graphic);
        Task<Graphic> UpdateGraphicAsync(Graphic graphic);
        Task<int> DeleteGraphicAsync(Graphic graphic);
    }
}