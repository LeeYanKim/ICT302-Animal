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

        public async Task<List<JobsPending>> GetJobsPendingAsync()
        {
            var jobsPending = await _ctx.JobsPending.ToListAsync();
            if(jobsPending.Any())
            {
                jobsPending.ForEach(j => _ctx.JobsPending.Attach(j));
            }
            return jobsPending;
        }

        public async Task<JobsPending?> GetPendingJobByQueuePosition(int queuePosition)
        {
            var jobs = await _ctx.JobsPending.ToListAsync();
            var job = jobs.Find(j => j.QueueNumber == queuePosition);
            if (job != null)
            {
                await _ctx.Entry(job).Reference(j => j.JobDetails).LoadAsync();
                await _ctx.Entry(job.JobDetails).Reference(j => j.Graphic).LoadAsync();
                await _ctx.Entry(job.JobDetails.Graphic).Reference(j => j.Animal).LoadAsync();
                await _ctx.Entry(job.JobDetails).Reference(j => j.Model3D).LoadAsync();
            }

            return job;
        }

        public async Task<JobsPending?> GetJobsPendingByIDAsync(int id)
        {
            var job = await _ctx.JobsPending.FindAsync(id);
            if(job != null)
                _ctx.JobsPending.Attach(job);
            return job;
        }

        public async Task<JobsPending> CreateJobsPendingAsync(JobsPending jobsPending)
        {
            // New pending jobs objects will default to -1 queue number until created
            var currentPendingJobs = await GetJobsPendingAsync();
            if (currentPendingJobs.Any())
            {
                jobsPending.QueueNumber = currentPendingJobs.Count + 1;
            }
            else
            {
                jobsPending.QueueNumber = 1;
            }
            _ctx.JobsPending.Attach(jobsPending);
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
