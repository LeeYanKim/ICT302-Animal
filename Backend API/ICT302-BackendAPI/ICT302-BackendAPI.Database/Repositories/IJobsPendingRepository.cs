using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IJobsPendingRepository
    {
        Task<JobsPending> CreateJobsPendingAsync(JobsPending jobsPending);
        Task<int> DeleteJobsPendingAsync(JobsPending jobsPending);
        Task<JobsPending?> GetJobsPendingByIDAsync(Guid id);
        Task<IEnumerable<JobsPending>> GetJobsPendingAsync();
        Task<JobsPending> UpdateJobsPendingAsync(JobsPending jobsPending);
    }
}
