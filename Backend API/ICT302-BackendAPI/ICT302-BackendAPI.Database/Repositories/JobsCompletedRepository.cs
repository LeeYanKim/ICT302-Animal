using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class JobsCompletedRepository(SchemaContext ctx) : IJobsCompletedRepository
    {
        public async Task<JobsCompleted?> GetCompletedJobsFromJobDetailsIdAsync(Guid? jobDetailsId)
        {
            if(jobDetailsId == null || jobDetailsId == Guid.Empty) return null;
            
            if (!await ctx.CheckDbIsAvailable())
                return null;

            
            var jobs = await ctx.JobsCompleted.ToListAsync();
            var job = jobs.Find(jd => jd.JDID == jobDetailsId);

            if (job != null)
            {
                ctx.JobsCompleted.Attach(job);
            }
            
            return job;
        }

        public async Task<IEnumerable<JobsCompleted>?> GetJobsCompletedAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var jobs = await ctx.JobsCompleted.ToListAsync();
            return jobs;
        }

        public async Task<JobsCompleted?> GetCompletedJobsByIdAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var job = await ctx.JobsCompleted.FindAsync(id);
            if (job != null)
            {
                ctx.JobsCompleted.Attach(job);
            }
            return job;
        }

        public async Task<JobsCompleted?> CreateJobsCompletedAsync(JobsCompleted job)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Entry<JobsCompleted>(job).State = EntityState.Added;
            ctx.JobsCompleted.Attach(job);
            ctx.JobsCompleted.Add(job);
            await ctx.SaveChangesAsync();
            return job;
        }
        
        public async Task<JobsCompleted?> CreateJobsCompletedAsync(JobsCompleted job, bool attach)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Entry<JobsCompleted>(job).State = EntityState.Added;
            if (attach)
                ctx.JobsCompleted.Attach(job);
            ctx.JobsCompleted.Add(job);
            await ctx.SaveChangesAsync();
            return null;
        }

        public async Task<JobsCompleted?> UpdateJobsCompletedAsync(JobsCompleted job)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.JobsCompleted.Update(job);
            await ctx.SaveChangesAsync();
            return job;
        }

        public async Task<int?> DeleteJobsCompletedAsync(JobsCompleted job)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.JobsCompleted.Remove(job);
            return await ctx.SaveChangesAsync();
        }
    }
}
