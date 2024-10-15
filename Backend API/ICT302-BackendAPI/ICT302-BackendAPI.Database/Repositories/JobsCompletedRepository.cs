using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class JobsCompletedRepository : IJobsCompletedRepository
    {
        private readonly SchemaContext _ctx;

        public JobsCompletedRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<JobsCompleted>> GetJobsCompletedAsync()
        {
            var jobs = await _ctx.JobsCompleted.ToListAsync();
            return jobs;
        }

        public async Task<JobsCompleted?> GetJobsCompletedByIDAsync(Guid id)
        {
            var job = await _ctx.JobsCompleted.FindAsync(id);
            return job;
        }

        public async Task<JobsCompleted> CreateJobsCompletedAsync(JobsCompleted job)
        {
            _ctx.JobsCompleted.Add(job);
            await _ctx.SaveChangesAsync();
            return job;
        }

        public async Task<JobsCompleted> UpdateJobsCompletedAsync(JobsCompleted job)
        {
            _ctx.JobsCompleted.Update(job);
            await _ctx.SaveChangesAsync();
            return job;
        }

        public async Task<int> DeleteJobsCompletedAsync(JobsCompleted job)
        {
            _ctx.JobsCompleted.Remove(job);
            return await _ctx.SaveChangesAsync();
        }
    }
}
