using System.Net.Http.Json;
using ICT302_BackendAPI.API.Generation;
using ICT302_BackendAPI.Database.Models;
using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ICT302_BackendAPI.API.APIs;

[Route("api/generate")]
[ApiController]
public class GenerationController : ControllerBase
{
    public class GenerationRequest
    {
        public Guid? AnimalId { get; set; }
        public string? AnimalGraphicFileName { get; set; }
        public Guid? GraphicID { get; set; }
        
        public string? GenType { get; set; }
    }
    
    private readonly IConfiguration _configuration;
    private readonly IJobDetailsRepository _jobDetailsRepository;
    private readonly IJobsPendingRepository _jobsPendingRepository;
    private readonly IJobsCompletedRepository _jobsCompletedRepository;
    private readonly IGraphicRepository _graphicRepository;
    private readonly IModel3DRepository _model3DRepository;
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly ILogger<GenerationController> _logger;
    private readonly MonitorJobLoop _jobLoop;
    private readonly IAnimalRepository _animalRepository;
    
    private static HttpClient? _sharedHttpClient = null;

    public GenerationController(IConfiguration configuration, ILogger<GenerationController> logger,
        IWebHostEnvironment webHostEnvironment, IGraphicRepository graphicRepository,
        IJobDetailsRepository jobDetailsRepository,IJobsPendingRepository jobsPendingRepository,
        IJobsCompletedRepository jobsCompletedRepository, IModel3DRepository model3DRepository,
        MonitorJobLoop jobLoop, IAnimalRepository animalRepository)
    {
        _configuration = configuration;
        _logger = logger;
        _jobDetailsRepository = jobDetailsRepository;
        _jobsPendingRepository = jobsPendingRepository;
        _jobsCompletedRepository = jobsCompletedRepository;
        _webHostEnvironment = webHostEnvironment;
        _graphicRepository = graphicRepository;
        _model3DRepository = model3DRepository;
        _jobLoop = jobLoop;
        _animalRepository = animalRepository;
    }

    [HttpGet]
    public ActionResult IsAlive()
    {
        var client = new HttpClient()
        {
            BaseAddress = new Uri(_configuration["GenAPIUrl"])
        };
        var data = new
        {
            Token = _configuration["GenAPIAuthToken"]
        };
        
        var request = new HttpRequestMessage(HttpMethod.Post, new Uri(_configuration["GenAPIUrl"]));
        var content = new MultipartFormDataContent();
        content.Add(JsonContent.Create(data), "StartGenerationJson");

        request.Content = content;
        var res = client.Send(request);
        return Ok(res.IsSuccessStatusCode);

    }

    [HttpPost]
    public async Task<ActionResult> GenerateFromGraphicAsync(GenerationRequest? request)
    {
        try
        {
            //Safety checks on request data
            if (request == null)
                return BadRequest(new { message = "Error: No request information provided" });

            if (request.AnimalId == null)
                return BadRequest(new { message = "Error: No AnimalID provided within request" });

            if (string.IsNullOrEmpty(request.AnimalGraphicFileName))
                return BadRequest(new { message = "Error: No Graphic File Name provided within request" });

            if (string.IsNullOrEmpty(request.GenType))
                return BadRequest(new { message = "Error: No Generation Type provided within request" });

            // TODO: Check file name, might need to do some directory/path changes for valid file name
            Graphic? graphic = request.GraphicID != null
                ? await _graphicRepository.GetGraphicByIDAsync(request.GraphicID)
                : await _graphicRepository.GetGraphicByFileNameAsync(request.AnimalGraphicFileName);

            if (graphic == null)
                return BadRequest(new { message = "Error: No Graphic could be found with provided ID or file name" });

            graphic.Animal = await _animalRepository.GetAnimalByIdAsync(graphic.AnimalID);
            
            _logger.LogInformation($"3D model for animal: {graphic.AnimalID} with graphic: {graphic.GPCName} has been requested. Checking job status...");

            graphic.FilePath = Path.GetFileName(graphic.FilePath);

            // Checking if the graphic has already processed a job or pending job making it a duplicate request
            JobDetails? jobDetails = await _jobDetailsRepository.GetJobDetailsByGraphicIdAsync(graphic.GPCID);
            var jobsPending = await _jobsPendingRepository.GetJobsPendingAsync();
            if (jobDetails != null)
            {
                // Check if Job has already been completed
                JobsCompleted? completedJob =
                    await _jobsCompletedRepository.GetCompletedJobsFromJobDetailsIdAsync(jobDetails.JDID);
                if (completedJob != null)
                    return BadRequest(new
                    {
                        message =
                            $"Error: Requested generation job was already completed with jobID: {completedJob.JobID}"
                    });

                // Check if job is the queue
                if (jobsPending.Any())
                {
                    var pendingJob = jobsPending.Find(job => job.JobDetailsId == jobDetails.JDID);
                    if (pendingJob != null)
                        return BadRequest(new
                        {
                            message =
                                $"Error: Requested generation job is already queued with jobID: {pendingJob.JobDetailsId} in queue position: {pendingJob.QueueNumber}"
                        });
                }

                return BadRequest(new
                {
                    message =
                        $"Error: Requested generation job with jobID: {jobDetails.JDID} has details but isnt in the queue or complete... Internal Job error?"
                });

            }


            // If all checks passed... The job can now be created and submitted to the generation API
            
            
            // Create the model record for the job
            var model = new Model3D
            {
                GPCID = graphic.GPCID,
                ModelID = Guid.NewGuid(),
                ModelTitle = graphic.GPCName,
                FilePath = graphic.GPCID + ".glb",
                ModelDateGen = DateTime.Now
            };
            await _model3DRepository.CreateModel3DAsync(model);

            // Create the details for the job
            var newJob = new JobDetails
            {
                JDID = Guid.NewGuid(),
                GPCID = graphic.GPCID,
                ModelGenType = request.GenType,
                ModelID = model.ModelID
            };
            await _jobDetailsRepository.CreateJobDetailsAsync(newJob);

            _logger.LogInformation("Required model and job details generated... adding to job queue...");

            //Create the Pending job and let the repo set the queue position
            var newPendingJob = new JobsPending
            {
                JobDetails = newJob,
                JobDetailsId = newJob.JDID,
                QueueNumber = -1,
                Status = JobStatus.Submitted,
                JobAdded = DateTime.Now
            };
            await _jobsPendingRepository.CreateJobsPendingAsync(newPendingJob);

            // Telling the job monitor there's a job pending and needs to be added to the job queue
            // DO NOT await. We don't want the api to wait for gen to complete before returning to the frontend
            // This is a fire and forget return. A background thread will do the work from here
            _jobLoop.AssignJobWorkItem();

            return Ok(new { message = "Success: Job was successfully lodged and will begin generation shortly!" });
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            return BadRequest();
        }
    }
}