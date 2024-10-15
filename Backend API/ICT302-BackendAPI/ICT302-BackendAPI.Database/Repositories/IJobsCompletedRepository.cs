using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IJobsCompletedRepository
    {
        Task<JobsCompleted> CreateJobsCompletedAsync(JobsCompleted job);
        Task<int> DeleteJobsCompletedAsync(JobsCompleted job);
        Task<JobsCompleted?> GetJobsCompletedByIDAsync(Guid id);
        Task<IEnumerable<JobsCompleted>> GetJobsCompletedAsync();
        Task<JobsCompleted> UpdateJobsCompletedAsync(JobsCompleted job);
    }
}
