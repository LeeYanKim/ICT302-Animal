using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IOrganisationAccessRepository
    {
        Task<OrganisationAccess> CreateOrganisationAccessAsync(OrganisationAccess organisationAccess);
        Task<int> DeleteOrganisationAccessAsync(OrganisationAccess organisationAccess);
        Task<OrganisationAccess> GetOrganisationAccessByIDAsync(Guid id);
        Task<IEnumerable<OrganisationAccess>> GetOrganisationAccessesAsync();
        Task<OrganisationAccess> UpdateOrganisationAccessAsync(OrganisationAccess organisationAccess);
    }
}
