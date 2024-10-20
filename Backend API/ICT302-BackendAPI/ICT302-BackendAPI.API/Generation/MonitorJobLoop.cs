using System.Net.Http.Json;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using ZstdSharp.Unsafe;

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

    private static int totalInQueue = 0;
    private static int apiAliveDelayS = 10;
    
    private static int apiAliveDelayMs = apiAliveDelayS * 1000;
    
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
        
        //Check if the Generator API is alive and note how many items are waiting...
        //if alive continue with work items, if not delay for x seconds and check again until gen api is alive
        var genApiUrl = new Uri(webHostEnvironment.IsDevelopment() ? "http://localhost:5000/alive" : configuration["GenAPIUrl"] + "/alive");
        HttpResponseMessage? alive = null;
        
        var data = new
        {
            Token = configuration["GenAPIAuthToken"]
        };
        
        using var request = new HttpRequestMessage(HttpMethod.Post, genApiUrl);
        using var content = new MultipartFormDataContent
        {
            // Other data
            {JsonContent.Create(data), "StartGenerationJson"},
        };
                    
        request.Content = content;

        totalInQueue++;
        
        while (alive == null || alive.IsSuccessStatusCode)
        {
            try
            {
                alive = GetHttpClient().Send(request);
                var response = await alive.Content.ReadAsStringAsync();
            }
            catch (Exception e)
            {
                logger.LogWarning($"Generation API is down or not responding... retrying in {apiAliveDelayS} seconds...");
                var delay = Task.Delay(apiAliveDelayMs);
                await delay;
            }
        }

        for (var i = 0; i < totalInQueue; i++)
        {
            taskQueue.QueueBackgroundWorkItemAsync(BuildJobWorkItem);
        }
    }

    private async ValueTask BuildJobWorkItem(CancellationToken token)
    {
        var job = await jobsPendingRepository.GetPendingJobByQueuePosition(1);

        if (job is null)
            return;
        
        string storedFilesPath = "";
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
        while (!token.IsCancellationRequested && job.Status != "Closed")
        {
            string genEndpoint = GetEndpointFromCurrentStep(job.Status);
            HttpResponseMessage? result = null;
            try
            {
                var data = new
                {
                    Token = configuration["GenAPIAuthToken"], JobID = job.JobDetailsId,
                    FilePath = job.JobDetails.Graphic.FilePath
                };
                
                if (job.Status == "Pending")
                {
                    using var request = new HttpRequestMessage(HttpMethod.Post, genEndpoint);
                    using var stream =
                        File.OpenRead(Path.Join(storedFilesPath, job.JobDetails.Graphic.FilePath));
                    using var content = new MultipartFormDataContent
                    {
                        // file
                        { new StreamContent(stream), "InputFile", job.JobDetails.Graphic.FilePath },
                        
                        // Other data
                        {JsonContent.Create(data), "StartGenerationJson"},
                    };

                    request.Content = content;

                    result = GetHttpClient().Send(request);
                }
                else
                {
                    if (job.Status == "Closing")
                        continue;
                    
                    using var request = new HttpRequestMessage(HttpMethod.Post, genEndpoint);
                    using var content = new MultipartFormDataContent
                    {
                        // Other data
                        {JsonContent.Create(data), "StartGenerationJson"},
                    };
                    
                    request.Content = content;

                    result = GetHttpClient().Send(request);
                }

                if (result.IsSuccessStatusCode && (job.Status == "Pending" || job.Status == "PreProcessing" || job.Status == "Generating" || job.Status == "Converting" || job.Status == "Cleaning-Up"))
                {
                    job.Status = GetNextJobStepFromPreviousStep(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);
                    continue;
                }

                if (job.Status == "Finished")
                {
                    job.Status = GetNextJobStepFromPreviousStep(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);
                    continue;
                }
                
                if (result.IsSuccessStatusCode && job.Status == "Fetching")
                {
                    job.Status = GetNextJobStepFromPreviousStep(job.Status);
                    await jobsPendingRepository.UpdateJobsPendingAsync(job);

                    using (var fs = new FileStream(
                               Path.Join(storedFilesPath, job.JobDetails.JDID.ToString() + ".glb"),
                               FileMode.CreateNew))
                    {
                        await result.Content.CopyToAsync(fs);
                    }
                    logger.LogInformation(
                        $"File saved...");
                }
                
                if (job.Status == "Closing")
                {
                    var comp = new JobsCompleted();
                    comp.JobID = job.JobDetailsId;
                    comp.JobDetails = job.JobDetails;
                    comp.JobsEnd = DateTime.Now;
                    comp.JobType = "BITE"; // TODO: Update this to grab from the original request
                    comp.JobSize = job.JobDetails.Graphic.GPCSize;
                    comp.JobsStart = startTime;
                    await jobsCompletedRepository.CreateJobsCompletedAsync(comp);
                    
                    await jobsPendingRepository.DeleteJobsPendingAsync(job);
                }
                

                if (job.Status == "Error")
                {
                    logger.LogInformation(
                        $"Queued work item {job.JobDetailsId} occured an error and has been canceled.");
                    var jd = job.JobDetails;
                    await jobsPendingRepository.DeleteJobsPendingAsync(job);
                    await jobDetailsRepository.DeleteJobDetailsAsync(jd);
                    break;
                }
                
                // If we got to this point, there was an issue...
                job.Status = "Error";
                logger.LogError($"Error: job {job.JobDetailsId} failed.");
                var j = job.JobDetails;
                await jobsPendingRepository.DeleteJobsPendingAsync(job);
                await jobDetailsRepository.DeleteJobDetailsAsync(j);
                
            }
            catch (Exception e)
            {
                logger.LogInformation($"Error processing job: {e.Message}");
            }
        }

        
    }
    
    private string GetNextJobStepFromPreviousStep(string currentStep)
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
                return "Fetching";
            case "Fetching":
                return "Closing";
            case "Closing":
                return "Closed";
            case "Error":
                return "Closed";
            default:
                return "Closed";
        }
    }

    private string GetEndpointFromCurrentStep(string currentStep)
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
            case "Fetching":
                return "/api/gen/files";
            case "Closing":
                return "";
            case "Error":
                return "";
            case "Closed":
                return "";
            default:
                return "";
        }
    }
    
    private string GetMimeType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".mp4" => "video/mp4",
            ".mov" => "video/quicktime",
            ".avi" => "video/x-msvideo",
            ".mkv" => "video/x-matroska",
            _ => "application/octet-stream",
        };
    }
}