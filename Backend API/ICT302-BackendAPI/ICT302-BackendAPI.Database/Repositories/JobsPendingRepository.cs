using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class JobsPendingRepository : IJobsPendingRepository
    {
        private readonly SchemaContext _ctx;

        public JobsPendingRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<JobsPending>> GetJobsPendingAsync()
        {
            var jobsPending = await _ctx.JobsPending.ToListAsync();
            return jobsPending;
        }

        public async Task<JobsPending> GetJobsPendingByIDAsync(Guid id)
        {
            var job = await _ctx.JobsPending.FindAsync(id);
            return job;
        }

        public async Task<JobsPending> CreateJobsPendingAsync(JobsPending jobsPending)
        {
            _ctx.JobsPending.Add(jobsPending);
            await _ctx.SaveChangesAsync();
            return jobsPending;
        }

        public async Task<JobsPending> UpdateJobsPendingAsync(JobsPending jobsPending)
        {
            _ctx.JobsPending.Update(jobsPending);
            await _ctx.SaveChangesAsync();
            return jobsPending;
        }

        public async Task<int> DeleteJobsPendingAsync(JobsPending jobsPending)
        {
            _ctx.JobsPending.Remove(jobsPending);
            return await _ctx.SaveChangesAsync();
        }
    }
}
