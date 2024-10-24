using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IJobsCompletedRepository
    {
        Task<JobsCompleted?> CreateJobsCompletedAsync(JobsCompleted job);
        Task<JobsCompleted?> CreateJobsCompletedAsync(JobsCompleted job, bool attach);
        Task<int?> DeleteJobsCompletedAsync(JobsCompleted job);
        Task<JobsCompleted?> GetCompletedJobsByIdAsync(Guid id);
        Task<JobsCompleted?> GetCompletedJobsFromJobDetailsIdAsync(Guid? jobDetailsId);
        Task<IEnumerable<JobsCompleted>?> GetJobsCompletedAsync();
        Task<JobsCompleted?> UpdateJobsCompletedAsync(JobsCompleted job);
    }
}
