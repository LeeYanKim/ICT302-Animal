using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class JobDetailsRepository : IJobDetailsRepository
    {
        private readonly SchemaContext _ctx;

        public JobDetailsRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<JobDetails>> GetJobDetailsAsync()
        {
            var jobDetails = await _ctx.JobDetails.ToListAsync();
            return jobDetails;
        }

        public async Task<JobDetails> GetJobDetailsByIDAsync(Guid id)
        {
            var jobDetails = await _ctx.JobDetails.FindAsync(id);
            return jobDetails;
        }

        public async Task<JobDetails> CreateJobDetailsAsync(JobDetails jobDetails)
        {
            _ctx.JobDetails.Add(jobDetails);
            await _ctx.SaveChangesAsync();
            return jobDetails;
        }

        public async Task<JobDetails> UpdateJobDetailsAsync(JobDetails jobDetails)
        {
            _ctx.JobDetails.Update(jobDetails);
            await _ctx.SaveChangesAsync();
            return jobDetails;
        }

        public async Task<int> DeleteJobDetailsAsync(JobDetails jobDetails)
        {
            _ctx.JobDetails.Remove(jobDetails);
            return await _ctx.SaveChangesAsync();
        }
    }
}
