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
        Task<Graphic> CreateGraphicAsync(Graphic graphic);
        Task<int> DeleteGraphicAsync(Graphic graphic);
        Task<Graphic> UpdateGraphicAsync(Graphic graphic);
        Task<Graphic?> GetGraphicByIDAsync(Guid? id);
        
        Task<Graphic?> GetGraphicByFileNameAsync(string fileName);
    }
}