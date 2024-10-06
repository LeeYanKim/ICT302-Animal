using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IModel3DRepository
    {
        Task<Model3D> CreateModel3DAsync(Model3D model3D);
        Task<int> DeleteModel3DAsync(Model3D model3D);
        Task<Model3D> GetModel3DByIDAsync(Guid id);
        Task<IEnumerable<Model3D>> GetModel3DsAsync();
        Task<Model3D> UpdateModel3DAsync(Model3D model3D);
    }
}
