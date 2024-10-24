using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class JobsPendingRepository(SchemaContext ctx) : IJobsPendingRepository
    {
        public async Task<List<JobsPending>?> GetJobsPendingAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            var jobsPending = await ctx.JobsPending.ToListAsync();
            if(jobsPending.Count != 0)
            {
                jobsPending.ForEach(j => ctx.JobsPending.Attach(j));
            }
            return jobsPending;
        }

        public async Task<JobsPending?> GetPendingJobByQueuePosition(int queuePosition)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            var jobs = await ctx.JobsPending.ToListAsync();
            var job = jobs.Find(j => j.QueueNumber == queuePosition);
            
            if (job == null) return null;
            
            await ctx.Entry(job).Reference(j => j.JobDetails).LoadAsync();
            await ctx.Entry(job.JobDetails).Reference(j => j.Graphic).LoadAsync();
            await ctx.Entry(job.JobDetails.Graphic!).Reference(j => j!.Animal).LoadAsync();
            await ctx.Entry(job.JobDetails).Reference(j => j.Model3D).LoadAsync();
            

            return job;
        }

        public async Task<JobsPending?> GetJobsPendingByIDAsync(int id)
        {
            var job = await ctx.JobsPending.FindAsync(id);
            if(job != null)
                ctx.JobsPending.Attach(job);
            return job;
        }

        public async Task<bool> CheckDbAvailability()
        {
            return await ctx.CheckDbIsAvailable();
        }

        public async Task<JobsPending?> CreateJobsPendingAsync(JobsPending jobsPending)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            // New pending jobs objects will default to -1 queue number until created
            var currentPendingJobs = await GetJobsPendingAsync();
            if (currentPendingJobs != null && currentPendingJobs.Any())
            {
                jobsPending.QueueNumber = currentPendingJobs.Count + 1;
            }
            else
            {
                jobsPending.QueueNumber = 1;
            }
            ctx.JobsPending.Attach(jobsPending);
            ctx.JobsPending.Add(jobsPending);
            await ctx.SaveChangesAsync();
            return jobsPending;
        }

        public async Task<JobsPending?> UpdateJobsPendingAsync(JobsPending jobsPending)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.JobsPending.Update(jobsPending);
            await ctx.SaveChangesAsync();
            return jobsPending;
        }

        public async Task<int?> DeleteJobsPendingAsync(JobsPending jobsPending)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            ctx.JobsPending.Remove(jobsPending);
            return await ctx.SaveChangesAsync();
        }

        public async Task<bool?> ShuffleJobQueue()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;
            
            var pendingJobs = await ctx.JobsPending.ToListAsync();
            foreach (var job in pendingJobs)
            {
                job.QueueNumber -= 1;
                ctx.JobsPending.Update(job);
                await ctx.SaveChangesAsync();
            }

            return true;
        }
    }
}
