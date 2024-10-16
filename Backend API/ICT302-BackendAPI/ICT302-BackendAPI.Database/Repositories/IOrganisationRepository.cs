using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IOrganisationRepository
    {
        Task<Organisation> CreateOrganisationAsync(Organisation organisation);
        Task<int> DeleteOrganisationAsync(Organisation organisation);
        Task<Organisation?> GetOrganisationByIDAsync(Guid id);
        Task<IEnumerable<Organisation>> GetOrganisationsAsync();
        Task<Organisation> UpdateOrganisationAsync(Organisation organisation);
    }
}
