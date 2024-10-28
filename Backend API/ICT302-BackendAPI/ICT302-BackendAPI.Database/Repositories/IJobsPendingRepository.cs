using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IJobsPendingRepository
    {
        Task<bool> CheckDbAvailability();
        Task<JobsPending?> CreateJobsPendingAsync(JobsPending jobsPending);
        Task<int?> DeleteJobsPendingAsync(JobsPending jobsPending);
        Task<JobsPending?> GetJobsPendingByIDAsync(int id);
        Task<List<JobsPending>?> GetJobsPendingAsync();
        
        Task<JobsPending?> GetPendingJobByQueuePosition(int queuePosition);
        Task<JobsPending?> UpdateJobsPendingAsync(JobsPending jobsPending);
        Task<bool?> ShuffleJobQueue();
    }
}
