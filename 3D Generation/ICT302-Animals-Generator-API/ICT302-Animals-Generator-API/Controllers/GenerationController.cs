using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;
using System.IO;



namespace ICT302_Animals_Generator_API.Controllers;

    [ApiController]
    [Route("api/gen")]
    public class GenerationController : ControllerBase
    {

        private readonly ILogger<GenerationController> _logger;

        public GenerationController(ILogger<GenerationController> logger)
        {
            _logger = logger;
        }

        [HttpPost("start")]
        public async Task<ActionResult> StartGenerationAsync(StartGenerationModel? model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.FilePath))
                {
                    _logger.LogInformation("Error: No details provided for generation.");
                    return StatusCode(StatusCodes.Status204NoContent, new
                    {
                        statusCode = 204,
                        message = "Error: No details provided for generation."
                    });
                }
                
                var preProcResult = await StartPreProcessingAsync(model);
                if (preProcResult.StatusCode != 200)
                {
                    _logger.LogInformation(preProcResult.Message);
                    return StatusCode(preProcResult.StatusCode, new { jobStatus = preProcResult.StatusDetail, message = preProcResult.Message});
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    message = e.Message
                });
            }
            return Ok();
        }
        
        private async Task<StatusResult> StartPreProcessingAsync(StartGenerationModel? model)
        {
            if (model == null)
                return new StatusResult(400, JobStatus.IncompleteData, "Error: No details provided for generation.");
            
            // Check if file is found and create output folder
            var valid = ValidFileCheck(model.FilePath);
            if (valid.StatusCode != 200)
            {
                _logger.LogInformation(valid.Message);
                return new StatusResult(valid.StatusCode, JobStatus.FailedFileValidation, valid.Message);
            }
            
            // Start frame splitting
            var frameResult = await StartFrameSplittingAsync(model, GetOutputPath(model.FilePath)!);
            if (frameResult.StatusCode != 200)
            {
                _logger.LogInformation(frameResult.Message);
                return new StatusResult(frameResult.StatusCode, JobStatus.FailedFramePreparation, frameResult.Message);
            }
            
            // Start frame masking only if value is entered
            if (!string.IsNullOrEmpty(model.SubjectHint))
            {
                var maskResult = await StartFrameMaskingAsync(model, GetOutputPath(model.FilePath)!);
                if (frameResult.StatusCode != 200)
                {
                    _logger.LogInformation(maskResult.Message);
                    return new StatusResult(maskResult.StatusCode, JobStatus.FailedFramePreparation,
                        maskResult.Message);
                }
            }

            // Select best frame/s
            var frameEvalResult = await StartFrameEvaluationAsync(model, GetOutputPath(model.FilePath)!);
            if (frameEvalResult.Item1.StatusCode != 200)
            {
                _logger.LogInformation(frameEvalResult.Item1.Message);
                return new StatusResult(frameEvalResult.Item1.StatusCode, JobStatus.FailedEvaluation, frameEvalResult.Item1.Message);
            }
            
            //Cant get to this point unless all preparation steps are successful
            return new StatusResult(200, JobStatus.CompletedPreparing, "Success: Input file has been prepared successfully for generation.");
        }

        /**
         * <summary> Splits the input video into frame images</summary>
         *
         * <param name="model"> The model information</param>
         *
         * <param name="outputPath"> The output path used</param>
         *
         * <returns>A StatusResult representing the result of the method</returns>
         */
        private async Task<StatusResult> StartFrameSplittingAsync(StartGenerationModel? model, string outputPath)
        {
            try
            {
                _logger.LogInformation($"Starting frame splitting for {model.FilePath}, outputting into: {outputPath + "/images"}");
                Directory.CreateDirectory(outputPath + "/images");
                var outFormat = "/%003d.png";
                var startInfo = new ProcessStartInfo(fileName: "c:/ffmpeg/bin/ffmpeg.exe", arguments: new[]{ "-i", model.FilePath, "-filter:v", "fps=5", outputPath + "/images" + outFormat  });
                startInfo.CreateNoWindow = true;
                startInfo.UseShellExecute = false;
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                var proc = Process.Start(startInfo);
                await proc.WaitForExitAsync().ConfigureAwait(false);
                _logger.LogInformation($"Frame splitting for {model.FilePath}, outputting into: {outputPath + "/images"} has completed successfully.");
                return new StatusResult(200, JobStatus.CompleteFrames, "Success: Frames have been split.");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new StatusResult(500, JobStatus.FailedFramePreparation, "Error: There was an error when splitting the frames of the input file.");
            }
        }

        /**
         * <summary> Checks if the file path contains a valid file and creates an output directory for generation</summary>
         *
         * <param name="model"> The model information</param>
         *
         * <param name="outputPath"> The output path used</param>
         *
         * <returns>A StatusResult representing the result of the method and an int[] storing the top 4 frames indices to use for generation</returns>
         */
        private async Task<(StatusResult, int[])> StartFrameEvaluationAsync(StartGenerationModel? model, string outputPath)
        {
            return (new StatusResult(200, JobStatus.CompleteEvaluation, "Success: top 4 frames have been evaluated."), [1]);
        }

        private async Task<StatusResult> StartFrameMaskingAsync(StartGenerationModel? model, string outputPath)
        {
            try
            {
                _logger.LogInformation($"Starting frame masking for {model.FilePath}, outputting into: {outputPath + "/masks"}");
                Directory.CreateDirectory(outputPath + "/masks");
                
                return new StatusResult(200, JobStatus.CompleteFrames, "Success: Frames have been masked.");
                
                
                var outFormat = "/%003d.png";
                var startInfo = new ProcessStartInfo(fileName: "c:/ffmpeg/bin/ffmpeg.exe", arguments: new[]{ "-i", model.FilePath, "-filter:v", "fps=5", outputPath + "/images" + outFormat  });
                startInfo.CreateNoWindow = true;
                startInfo.UseShellExecute = false;
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                var proc = Process.Start(startInfo);
                await proc.WaitForExitAsync().ConfigureAwait(false);
                _logger.LogInformation($"Frame masking for {model.FilePath}, outputting into: {outputPath + "/masks"} has completed successfully.");
                return new StatusResult(200, JobStatus.CompleteFrames, "Success: Frames have been masked.");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new StatusResult(500, JobStatus.FailedFramePreparation, "Error: There was an error when splitting the frames of the input file.");
            }
        }

        private async Task<StatusResult> StartProcessingAsync(StartGenerationModel? model, string outputPath)
        {
            return new StatusResult(200, JobStatus.CompleteGeneration, "Success: 3D model has been generated");
            
            //ToDo finish
            try
            {
                _logger.LogInformation($"Starting frame splitting for {model.FilePath}, outputting into: {outputPath + "/images"}");
                Directory.CreateDirectory(outputPath + "/images");
                var outFormat = "/%003d.png";
                var startInfo = new ProcessStartInfo(fileName: "c:/ffmpeg/bin/ffmpeg.exe", arguments: new[]{ "-i", model.FilePath, "-filter:v", "fps=5", outputPath + "/images" + outFormat  });
                startInfo.CreateNoWindow = true;
                startInfo.UseShellExecute = false;
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                var proc = Process.Start(startInfo);
                await proc.WaitForExitAsync().ConfigureAwait(false);
                _logger.LogInformation($"Frame splitting for {model.FilePath}, outputting into: {outputPath + "/images"} has completed successfully.");
                return new StatusResult(200, JobStatus.CompleteFrames, "Success: Frames have been split.");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new StatusResult(500, JobStatus.FailedFramePreparation, "Error: There was an error when splitting the frames of the input file.");
            }
        }

        /**
         * <summary> Checks if the file path contains a valid file and creates an output directory for generation</summary>
         *
         * <param name="filePath"> The file path to validate</param>
         *
         * <returns>A StatusResult representing the result of the method.</returns>
         */
        private StatusResult ValidFileCheck(string filePath)
        {
            try
            {
                var outputPath = GetOutputPath(filePath);
                if (!string.IsNullOrEmpty(outputPath))
                {
                    Directory.CreateDirectory(outputPath);
                    _logger.LogInformation($"Success: Valid file found and output directory created at path: {outputPath}");
                    return new StatusResult(200, JobStatus.CompleteFrames,
                        $"Success: Valid file found and output directory created at path: {outputPath}");
                }
                _logger.LogError($"Error: No valid file found at path: {filePath}");
                return new StatusResult(404, JobStatus.FailedFileValidation,
                    $"Error: No valid file found at path: {filePath}");
                
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new StatusResult(500, JobStatus.FailedFileValidation,
                    $"Error: " + e.Message);
            }
        }

        /**
         * <summary> Gets the output path for generation. </summary>
         *
         * <param name="filePath"> The file path of the file being generated</param>
         *
         * <returns>Output path as string or null if an error occurs.</returns>
         */
        private string? GetOutputPath(string filePath)
        {
            if (System.IO.File.Exists(filePath))
            {
                string fileName = Path.GetFileNameWithoutExtension(filePath);
                string? directory = Path.GetDirectoryName(filePath);
                if (directory != null)
                {
                    string outputPath = Path.Join(directory, "gen_out_" + fileName);
                    return outputPath.Replace("\\", "/");
                }

                return null;
            }

            return null;
        }
        

    }

