using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class JobDetailsRepository(SchemaContext ctx) : IJobDetailsRepository
    {
        public async Task<JobDetails?> GetJobDetailsByGraphicIdAsync(Guid? graphicId)
        {
            if (graphicId == null) return null;

            if (!await ctx.CheckDbIsAvailable())
                return null;

            var jobs = await ctx.JobDetails.ToListAsync();
            var job = jobs.Find(job => job.GPCID == graphicId);
            return job;
        }

        public async Task<IEnumerable<JobDetails>?> GetJobDetailsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var jobDetails = await ctx.JobDetails.ToListAsync();
            return jobDetails;
        }

        public async Task<JobDetails?> GetJobDetailsByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var jobDetails = await ctx.JobDetails.FindAsync(id);
            if (jobDetails != null)
            {
                ctx.JobDetails.Attach(jobDetails);
            }
            return jobDetails;
        }

        public async Task<JobDetails?> CreateJobDetailsAsync(JobDetails jobDetails)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.JobDetails.Attach(jobDetails);
            ctx.JobDetails.Add(jobDetails);
            await ctx.SaveChangesAsync();
            return jobDetails;
        }

        public async Task<JobDetails?> UpdateJobDetailsAsync(JobDetails jobDetails)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.JobDetails.Update(jobDetails);
            await ctx.SaveChangesAsync();
            return jobDetails;
        }

        public async Task<int?> DeleteJobDetailsAsync(JobDetails jobDetails)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.JobDetails.Remove(jobDetails);
            return await ctx.SaveChangesAsync();
        }
    }
}
