using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IOrgRequestsRepository
    {
        Task<OrgRequests> CreateOrgRequestsAsync(OrgRequests orgRequests);
        Task<int> DeleteOrgRequestsAsync(OrgRequests orgRequests);
        Task<OrgRequests> GetOrgRequestsByIDAsync(Guid id);
        Task<IEnumerable<OrgRequests>> GetOrgRequestsAsync();
        Task<OrgRequests> UpdateOrgRequestsAsync(OrgRequests orgRequests);
    }
}
