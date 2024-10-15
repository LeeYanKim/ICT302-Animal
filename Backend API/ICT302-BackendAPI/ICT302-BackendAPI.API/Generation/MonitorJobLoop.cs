using System.Net.Http.Json;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ICT302_BackendAPI.API.Generation;

public sealed class MonitorJobLoop(
    IBackgroundJobQueue taskQueue,
    ILogger<MonitorJobLoop> logger,
    IConfiguration configuration,
    IHostApplicationLifetime applicationLifetime,
    IJobsPendingRepository jobsPendingRepository)
{
    private HttpClient? _sharedHttpClient;
    
    private readonly CancellationToken _cancellationToken = applicationLifetime.ApplicationStopping;
    public void StartMonitorLoop()
    {
        logger.LogInformation($"Pending job queue monitor loop is starting.");
        
        // Run a init check if there are any pending jobs on start up
        Task.Run(async () => await AssignJobWorkItem());
    }

    private HttpClient GetHttpClient()
    {
        if (_sharedHttpClient == null)
        {
            _sharedHttpClient = new()
            {
                BaseAddress = new Uri(configuration["GenerationApiAddress"] ?? "http://localhost:5000")
            };
            return _sharedHttpClient;
        }
        return _sharedHttpClient;
    }

    public async ValueTask AssignJobWorkItem()
    {
        await taskQueue.QueueBackgroundWorkItemAsync(BuildJobWorkItem);
    }

    private async ValueTask BuildJobWorkItem(CancellationToken token)
    {
        var job = await jobsPendingRepository.GetPendingJobByQueuePosition(1);

        if (job is null)
            return;
        
        // Each step of processing. Job is finished when status is Closed
        while (!token.IsCancellationRequested && job.Status != "Closed")
        {
            string genEndpoint = GetEndpointFromPreviusStep(job.Status);

            try
            {
                var data = new
                {
                    JobID = job.JobDetailsId, FilePath = Path.Join(configuration["dev_StoredFilesPath"], job.JobDetails.Graphic.FilePath)
                };
                
                var result = await GetHttpClient().PostAsJsonAsync(genEndpoint, data);

                if (result.IsSuccessStatusCode)
                {
                    job.Status = GetNextJobStepFromPreviusStep(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);
                }
                else
                {
                    var message = await result.Content.ReadFromJsonAsync<(int, string, string)>();
                    job.Status = "Failed";
                    logger.LogError($"Error: job {job.JobDetailsId} failed with error: {message.Item3}.");
                }


                if (job.Status == "Finished")
                {
                    job.Status = GetNextJobStepFromPreviusStep(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);
                    continue;
                }

                if (job.Status == "Error")
                {
                    job.Status = "Closed";
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);
                    logger.LogInformation(
                        $"Queued work item {job.JobDetailsId} occured an error and has been canceled.");
                }
            }
            catch (Exception e)
            {
                logger.LogInformation($"Error processing job: {e.Message}");
            }
        }

        if (job.Status == "Closed")
        {
            // TODO: Add job complete
            await jobsPendingRepository.DeleteJobsPendingAsync(job);
        }
    }
    
    private string GetNextJobStepFromPreviusStep(string currentStep)
    {
        switch (currentStep)
        {
            case "Pending":
                return "PreProcessing";
            case "PreProcessing":
                return "Generating";
            case "Generating":
                return "Converting";
            case "Converting":
                return "Cleaning-Up";
            case "Cleaning-Up":
                return "Finished";
            case "Finished":
                return "Closed";
            case "Error":
                return "Closed";
            default:
                return "Closed";
        }
    }

    private string GetEndpointFromPreviusStep(string currentStep)
    {
        switch (currentStep)
        {
            case "Pending":
                return "/api/gen/preprocess/validate";
            case "PreProcessing":
                return "/api/gen/preprocess/split";
            case "Generating":
                return "/api/gen/start";
            case "Converting":
                return "/api/gen/postprocess/convert";
            case "Cleaning-Up":
                return "/api/gen/postprocess/cleanup";
            case "Finished":
                return "";
            case "Error":
                return "";
            case "Closed":
                return "";
            default:
                return "";
        }
    }
}