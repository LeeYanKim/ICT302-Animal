using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface IJobDetailsRepository
    {
        Task<JobDetails> CreateJobDetailsAsync(JobDetails jobDetails);
        Task<int> DeleteJobDetailsAsync(JobDetails jobDetails);
        Task<JobDetails?> GetJobDetailsByIDAsync(Guid id);
        Task<IEnumerable<JobDetails>> GetJobDetailsAsync();
        Task<JobDetails> UpdateJobDetailsAsync(JobDetails jobDetails);
    }
}
