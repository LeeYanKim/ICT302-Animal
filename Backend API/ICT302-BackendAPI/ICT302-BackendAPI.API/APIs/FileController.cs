using ICT302_BackendAPI.Database.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ICT302_BackendAPI.API.APIs
{
    [Route("api/files")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<FilesController> _logger;
        private readonly IAnimalRepository _animalRepository;
        private readonly IAnimalAccessRepository _animalAccessRepository;
        private readonly IGraphicRepository _graphicRepository;
        private readonly IModel3DRepository _model3DRepository;

        // Ensure there is only one constructor
        public FilesController(IConfiguration configuration, ILogger<FilesController> logger, 
            IAnimalRepository animalRepository, IWebHostEnvironment webHostEnvironment,  
            IAnimalAccessRepository animalAccessRepository, IGraphicRepository graphicRepository, IModel3DRepository model3DRepository)
        {
            _configuration = configuration;
            _logger = logger;
            _animalRepository = animalRepository;
            _webHostEnvironment = webHostEnvironment;
            _animalAccessRepository = animalAccessRepository; 
            _graphicRepository = graphicRepository;
            _model3DRepository = model3DRepository;
        }

        [HttpGet("animals/details/{id}")]
        public async Task<IActionResult> GetAnimalDetails(Guid id)
        {
            try
            {
                var animal = await _animalRepository.GetAnimalByIdAsync(id);
                if (animal == null)
                {
                    return NotFound(new { message = "Animal not found" });
                }

                // Construct video URLs dynamically based on the filename
                foreach (var graphic in animal.Graphics)
                {
                    if(_webHostEnvironment.EnvironmentName == "Development")
                        graphic.FilePath = $"http://{Request.Host}/api/files/animals/videos/{graphic.FilePath}";
                    else
                        graphic.FilePath = $"https://{Request.Host}/api/files/animals/videos/{graphic.FilePath}";
                }

                return Ok(animal);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving animal details.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }



        [HttpGet("animals/videos/{fileName}")]
        public IActionResult GetAnimalVideo(string fileName)
        {
            try
            {
                string? storedFilesPath = _webHostEnvironment.IsDevelopment()
                    ? _configuration.GetValue<string>("dev_StoredFilesPath")
                    : _configuration.GetValue<string>("StoredFilesPath");

                var filePath = Path.Combine(storedFilesPath!, fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    _logger.LogWarning("Requested video file not found: {FilePath}", filePath);
                    return NotFound(new { message = "Video file not found." });
                }

                var mimeType = GetMimeType(filePath);
                var videoStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return File(videoStream, mimeType, enableRangeProcessing: true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while serving video file: {FileName}", fileName);
                return StatusCode(500, new { message = "Internal server error while fetching video." });
            }
        }

        // Endpoint to get the list of animals
        [HttpGet("animals/list")]
        public async Task<IActionResult> GetAnimalsListAsync()
        {
            try
            {
                var animals = await _animalRepository.GetAnimalsAsync();

                return animals!.Any() ? Ok(new { message = "No animals found" }) : Ok(animals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching the list of animals");
                return StatusCode(500, new { message = "Internal server error while fetching animals list." });
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

        [HttpGet("user/{userID}/animalIDs")]
        public async Task<IActionResult> GetAnimalIDsByUserID(Guid userID)
        {
            try
            {
                var animalIDs = await _animalAccessRepository.GetAnimalIDsByUserIDAsync(userID);
                if (animalIDs!.Any())
                {
                    return NotFound(new { message = "No animals found for this user." });
                }
                return Ok(animalIDs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching animal IDs for the user.");
                return StatusCode(500, new { message = "Internal server error while fetching animal IDs." });
            }
        }

        [HttpGet("animals/models/graphics/{graphicsId}")]
        public async Task<ActionResult> GetAnimalModel(Guid graphicsId)
        {
            try
            {
                var model = await _model3DRepository.GetModel3DFromGraphicsIdAsync(graphicsId);
                if(model == null)
                    return NotFound(new { message = "Animal model not found" });
                
                return Ok(model);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while fetching the model from the provided graphic");
                return StatusCode(500, new { message = "Internal server error while fetching the model from the provided graphic" });
            }
        }

        [HttpGet("animals/models/{animalId}")]
        public async Task<ActionResult> GetAllModelsForAnimal(Guid animalId)
        {
            try
            {
                var models = await _model3DRepository.GetModel3DListFromAnimalIdAsync(animalId);
                if(models!.Count == 0)
                    return NotFound(new { message = "Animal model not found" });
                
                foreach (var model in models)
                {
                    if(_webHostEnvironment.EnvironmentName == "Development")
                        model.FilePath = $"http://{Request.Host}/api/files/animals/models/file/{model.FilePath}";
                    else
                        model.FilePath = $"https://{Request.Host}/api/files/animals/models/file/{model.FilePath}";
                }
                
                return Ok(models);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while fetching the model from the provided graphic");
                return StatusCode(500, new { message = "Internal server error while fetching the model from the provided graphic" });
            }
        }

        [HttpGet("animals/models/file/{fileName}")]
        public ActionResult GetModelFile(string fileName)
        {
            try
            {
                string? storedFilesPath = _webHostEnvironment.IsDevelopment()
                    ? _configuration.GetValue<string>("dev_StoredFilesPath")
                    : _configuration.GetValue<string>("StoredFilesPath");

                var filePath = Path.Combine(storedFilesPath!, fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    _logger.LogWarning("Requested model file not found: {FilePath}", filePath);
                    return NotFound(new { message = "Model file not found." });
                }

                var mimeType = GetMimeType(filePath);
                var modelStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return File(modelStream, mimeType, enableRangeProcessing: true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while serving model file: {FileName}", fileName);
                return StatusCode(500, new { message = "Internal server error while fetching model." });
            }
        }

    }
}