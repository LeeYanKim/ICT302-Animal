using System.Net.Http.Json;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;

namespace ICT302_BackendAPI.API.Generation;

public sealed class MonitorJobLoop(
    IBackgroundJobQueue taskQueue,
    ILogger<MonitorJobLoop> logger,
    IConfiguration configuration,
    IHostApplicationLifetime applicationLifetime,
    IJobsPendingRepository jobsPendingRepository,
    IJobsCompletedRepository jobsCompletedRepository,
    IJobDetailsRepository jobDetailsRepository,
    IWebHostEnvironment webHostEnvironment)
{
    private HttpClient? _sharedHttpClient;

    private static int _totalInQueue;
    private const int ApiAliveDelayS = 10;

    private const int ApiAliveDelayMs = ApiAliveDelayS * 1000;

    private readonly CancellationToken _cancellationToken = applicationLifetime.ApplicationStopping;
    public void StartMonitorLoop()
    {
        logger.LogInformation($"Pending job queue monitor loop is starting.");
        
        // Run an init check if there are any pending jobs on start up
        Task.Run(async () => await AssignJobWorkItem(), _cancellationToken);
    }

    private HttpClient GetHttpClient()
    {
        if (_sharedHttpClient == null)
        {
            _sharedHttpClient = new()
            {
                BaseAddress = new Uri(configuration["GenAPIUrl"] ?? "http://localhost:5000")
            };
            return _sharedHttpClient;
        }
        return _sharedHttpClient;
    }

    private async Task<HttpRequestMessage> CreateAliveRequestAsync()
    {
        var genApiUrl = new Uri(configuration["GenAPIUrl"] + "/alive");
        
        var data = new
        {
            Token = configuration["GenAPIAuthToken"]
        };
        
        var request = new HttpRequestMessage(HttpMethod.Post, genApiUrl);
        var content = new MultipartFormDataContent();
        content.Add(JsonContent.Create(data), "StartGenerationJson");

        request.Content = content;
        return request;
    }
    
    public async ValueTask AssignJobWorkItem()
    {
        
        //Check if the Generator API is alive and note how many items are waiting...
        //if alive continue with work items, if not delay for x seconds and check again until gen api is alive
        _totalInQueue++;
        
        HttpResponseMessage? alive = null;
        
        while (alive == null || alive.IsSuccessStatusCode)
        {
            try
            {
                alive = await GetHttpClient().SendAsync(await CreateAliveRequestAsync(), _cancellationToken);
            }
            catch (Exception e)
            {
                logger.LogWarning("Generation API is down or not responding... retrying in {seconds} seconds...", ApiAliveDelayS);
                logger.LogWarning("Error: {error}", e.Message);
                //await delay;
            }
        }

        for (var i = 0; i < _totalInQueue; i++)
        {
            await taskQueue.QueueBackgroundWorkItemAsync(BuildJobWorkItem);
        }
    }

    private async ValueTask BuildJobWorkItem(CancellationToken token)
    {
        var job = await jobsPendingRepository.GetPendingJobByQueuePosition(1);

        if (job is null)
            return;
        
        string storedFilesPath;
        if (webHostEnvironment.IsDevelopment())
        {
            // Dev environment
            var path = configuration["dev_StoredFilesPath"];
                storedFilesPath = path ?? "";
        }
        else
        {
            // Prod environment
            storedFilesPath = configuration["StoredFilesPath"] ?? "";
        }
        
        DateTime startTime = DateTime.Now;
        
        // Each step of processing. Job is finished when status is Closed
        while (!token.IsCancellationRequested && job.Status != JobStatus.Closed)
        {
            string genEndpoint = JobStatusHelper.GetJobStatusEndpoint(job.Status);
            try
            {
                var data = new
                {
                    Token = configuration["GenAPIAuthToken"], JobID = job.JobDetailsId,
                    FileName = job.JobDetails.Graphic.FilePath, SubjectHint = job.JobDetails.Graphic.Animal?.AnimalType,
                    ModelPath = job.JobDetails.JDID + ".glb", ModelVersion = 1
                };

                HttpResponseMessage? result = null;
                if (job.Status == JobStatus.Validating)
                {
                    using var request = new HttpRequestMessage(HttpMethod.Post, genEndpoint);
                    await using var stream =
                        File.OpenRead(Path.Join(storedFilesPath, job.JobDetails.Graphic.FilePath));
                    using var content = new MultipartFormDataContent();
                    
                    content.Add(new StreamContent(stream), "InputFile", job.JobDetails.Graphic.FilePath); // Other data
                    content.Add(JsonContent.Create(data), "StartGenerationJson");

                    request.Content = content;

                    result = await GetHttpClient().SendAsync(request, token);
                    logger.LogInformation("Result: {0}", result.Content.ReadAsStringAsync().Result );
                }
                else if (JobStatusHelper.IsJobInProcessingStaus(job.Status))
                {
                    if (job.Status != JobStatus.Submitted)
                    {
                        using var request = new HttpRequestMessage(HttpMethod.Post, genEndpoint);
                        using var content = new MultipartFormDataContent();
                        // Other data
                        content.Add(JsonContent.Create(data), "StartGenerationJson");

                        request.Content = content;

                        result = await GetHttpClient().SendAsync(request, token);
                        logger.LogInformation("Result: {0}", result.Content.ReadAsStringAsync().Result );
                    }
                }

                if ((result != null && result.IsSuccessStatusCode && JobStatusHelper.IsJobInProcessingStaus(job.Status)) || job.Status == JobStatus.Submitted)
                {
                    job.Status = JobStatusHelper.GetNextJobStatusFromPrevious(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);
                    continue;
                }

                if (job.Status == JobStatus.Finished)
                {
                    job.Status = JobStatusHelper.GetNextJobStatusFromPrevious(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);
                    continue;
                }
                
                if (result != null && result.IsSuccessStatusCode && job.Status == JobStatus.Fetching)
                {
                    job.Status = JobStatusHelper.GetNextJobStatusFromPrevious(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);

                    var modelFilePath = Path.Join(storedFilesPath, job.JobDetails.JDID + ".glb");
                    await using (var fs = new FileStream(modelFilePath, FileMode.CreateNew))
                    {
                        await result.Content.CopyToAsync(fs, token);
                    }
                    logger.LogInformation("Model file fetched successfully and saved to {modelFilePath}", modelFilePath);
                }
                
                if (job.Status == JobStatus.Closing)
                {
                    var comp = new JobsCompleted
                    {
                        JobID = job.JobDetailsId,
                        JobDetails = job.JobDetails,
                        JobsEnd = DateTime.Now,
                        JobType = "BITE", // TODO: Update this to grab from the original request
                        JobSize = job.JobDetails.Graphic.GPCSize,
                        JobsStart = startTime
                    };
                    await jobsCompletedRepository.CreateJobsCompletedAsync(comp);
                    await jobsPendingRepository.DeleteJobsPendingAsync(job);
                }
                

                if (job.Status == JobStatus.Error)
                {
                    logger.LogInformation("Queued work item {jobId} occured an error and has been canceled", job.JobDetailsId);
                    var jd = job.JobDetails;
                    await jobsPendingRepository.DeleteJobsPendingAsync(job);
                    await jobDetailsRepository.DeleteJobDetailsAsync(jd);
                    break;
                }

                if (job.Status != JobStatus.Submitted)
                {
                    // If we got to this point, there was an issue...
                    job.Status = JobStatus.Error;
                    logger.LogError("Error: job {jobId} failed.", job.JobDetailsId);
                    var j = job.JobDetails;
                    await jobsPendingRepository.DeleteJobsPendingAsync(job);
                    await jobDetailsRepository.DeleteJobDetailsAsync(j);
                }
            }
            catch (Exception e)
            {
                logger.LogInformation("Error processing job: {error}", e.Message);
            }
        }

        
    }
}