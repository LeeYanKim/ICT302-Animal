using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;
using System.IO;
using Aspose.ThreeD;



namespace ICT302_Animals_Generator_API.Controllers;

[ApiController]
[Route("api/gen")]
public class GenerationController : ControllerBase
{

    private readonly ILogger<GenerationController> _logger;
    private readonly IConfiguration _configuration;

    public GenerationController(ILogger<GenerationController> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("start")]
    public ActionResult StartGenerationAsync(StartGenerationModel? model)
    {
        try
        {
            if (model == null || string.IsNullOrEmpty(model.FilePath))
            {
                _logger.LogInformation("Error: No details provided for generation.");
                return StatusCode(StatusCodes.Status400BadRequest, new
                {
                    statusCode = 400,
                    jobStatus = "Failed Generation",
                    message = "Error: No details provided for generation."
                });
            }
            
            if (Directory.Exists(Path.Join(GetOutputPath(model.FilePath), model.GenOutputLoc)) &&
                Directory.GetFiles(Path.Join(GetOutputPath(model.FilePath), model.GenOutputLoc)).Length > 0)
            {
                // Output file full, masks already exist
                _logger.LogInformation($"Generation for job {model.JobID} has completed successfully.");
                return StatusCode(StatusCodes.Status200OK, new
                {
                    statusCode = 200,
                    jobStatus = "Completed Generation",
                    message = "Success: 3D model generation has completed successfully."
                });
            }

            if (string.IsNullOrEmpty(model?.OutputPath))
                model!.OutputPath = GetOutputPath(model.FilePath);
            
            _logger.LogInformation($"Starting frame masking for job: {model!.JobID}");
            Directory.CreateDirectory(model.OutputPath + model.GenOutputLoc);

            // TODO: Add safety check for directory and input files before launching BITE

            _logger.LogInformation($"Starting 3D generation for job: {model.JobID}");
            Directory.CreateDirectory(model.OutputPath + model.GenOutputLoc);

            var wslUser = _configuration.GetValue<string>("WslUser");
            var wslScriptPath = _configuration.GetValue<string>("WslScriptPath");
            var wslCondaEnv = _configuration.GetValue<string>("WslCondaEnv");
            var wslCmd = _configuration.GetValue<string>("WslStartCmd");
            
            string args = $"-d Ubuntu-20.04 -u {wslUser} sh -c \"cd \'{wslScriptPath!}\' && . ~/.bashrc && ~/anaconda3/bin/conda run -n {wslCondaEnv!} python ./gen_model.py -p \'{GetWslPathFromWindowsPath(model.OutputPath!)}\'";
            
            var startInfo = new ProcessStartInfo(fileName: wslCmd!, arguments: args)
            {
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };
            var proc = Process.Start(startInfo);
            proc?.WaitForExit();
            
            //TODO: Add exit code checks

            _logger.LogInformation($"3D generation for {model.JobID} has completed successfully.");
            return StatusCode(StatusCodes.Status200OK, new
            {
                statusCode = 200,
                jobStatus = "Completed Generation",
                message = "Success: Model has been generated successfully."
            });

        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                statusCode = 500,
                jobStatus = "Failed Generation",
                message = $"Error: {e.Message}"
            });
        }
    }

    [HttpPost("postprocess/convert")]
    public ActionResult StartGlbConversionAsync(StartGenerationModel? model)
    {
        try
        {
            if (model == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    jobStatus = "Failed GLB Conversion",
                    message = "Error: There was no details provided to process."
                });
            }

            if (string.IsNullOrEmpty(model?.OutputPath))
                if (model?.FilePath != null)
                    model!.OutputPath = GetOutputPath(model.FilePath);

            _logger.LogInformation($"Starting GLB conversion for job: {model?.FilePath}");

            //TODO: Remove
            _logger.LogInformation($"GLB conversion for job: {model.JobID} has completed successfully.");
            return StatusCode(StatusCodes.Status200OK, new
            {
                statusCode = 200,
                jobStatus = "Completed Conversion",
                message = "Success: GLB conversion completed successfully"
            });
            
            var scene = Scene.FromFile(Path.Join(model!.OutputPath, model.GenOutputLoc, "bite.obj"));
            var fileName = Path.GetFileNameWithoutExtension(model.FilePath);
            var root = Path.GetDirectoryName(model.FilePath);
            scene.Save(Path.Join(root, fileName + $"_v{model.ModelVersion ?? 1}.glb"));

            _logger.LogInformation($"GLB conversion for job: {model.JobID} has completed successfully.");
            return StatusCode(StatusCodes.Status200OK, new
            {
                statusCode = 200,
                jobStatus = "Completed Conversion",
                message = "Success: GLB conversion completed successfully"
            });

        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                statusCode = 500,
                jobStatus = "Failed Frame Splitting",
                message = "Error: There was an error when splitting the frames of the input file."
            });
        }
    }

    [HttpPost("postprocess/cleanup")]
    public ActionResult StartCleanUpAsync(StartGenerationModel? model)
    {
        try
        {
            if (model == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    jobStatus = "Failed File CleanUp",
                    message = "Error: There was no details provided to process clean up."
                });
            }

            if (string.IsNullOrEmpty(model?.OutputPath))
                if (model?.FilePath != null)
                    model!.OutputPath = GetOutputPath(model.FilePath);

            _logger.LogInformation($"Starting file clean up for job: {model?.JobID}");

            if (Directory.Exists(model!.OutputPath))
            {
                Directory.Delete(model!.OutputPath, true);
            }

            _logger.LogInformation($"File clean up for job: {model.JobID} has completed successfully.");
            return StatusCode(StatusCodes.Status200OK, new
            {
                statusCode = 200,
                jobStatus = "Completed CleanUp",
                message = "Success: File clean up completed successfully"
            });

        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                statusCode = 500,
                jobStatus = "Failed Frame Splitting",
                message = "Error: There was an error when splitting the frames of the input file."
            });
        }
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
    [HttpPost("preprocess/split")]
    public async Task<ActionResult> StartFrameSplittingAsync(StartGenerationModel? model)
    {
        try
        {
            if (model == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    jobStatus = "Failed Frame Masking",
                    message = "Error: There was no details provided to process."
                });
            }
            
            if (model.FilePath != null && Directory.Exists(Path.Join(GetOutputPath(model.FilePath), model.ImageOutputLoc)) && Directory.GetFiles(Path.Join(GetOutputPath(model.FilePath), model.ImageOutputLoc)).Length > 0)
            {
                // Output folder full, images already exist
                _logger.LogInformation($"Frame splitting for {model.JobID} has completed successfully.");
                return StatusCode(StatusCodes.Status200OK, new
                {
                    statusCode = 200,
                    jobStatus = "Completed Splitting",
                    message = "Success: Frames have been split."
                });
            }

            if (string.IsNullOrEmpty(model?.OutputPath))
                if (model?.FilePath != null)
                    model!.OutputPath = GetOutputPath(model.FilePath);

            _logger.LogInformation($"Starting frame splitting for {model!.JobID}");
            Directory.CreateDirectory(model!.OutputPath + model.ImageOutputLoc);

            var ffmpeg = _configuration.GetValue<string>("Ffmpeg_bin_path");

            var outFormat = "/%0004d.png";
            var startInfo = new ProcessStartInfo(fileName: ffmpeg!,
                arguments: $"-i {model.FilePath} -filter:v fps=1 {model!.OutputPath + model.ImageOutputLoc + outFormat}")
            {
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };
            var proc = Process.Start(startInfo);
            if (proc != null) await proc.WaitForExitAsync().ConfigureAwait(false);

            _logger.LogInformation($"Frame splitting for {model.JobID} has completed successfully.");
            return StatusCode(StatusCodes.Status200OK, new
            {
                statusCode = 200,
                jobStatus = "Completed Splitting",
                message = "Success: Frames have been split."
            });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                statusCode = 500,
                jobStatus = "Failed Frame Splitting",
                message = "Error: There was an error when splitting the frames of the input file."
            });
        }
    }

    /**
     * <summary> Checks if the file path contains a valid file and creates an output directory for generation</summary>
     *
     * <param name="model"> The model information</param>
     *
     * <returns>A ActionResult with a statusCode, jobStatus, selectedFrames and message within the response</returns>
     */
    [HttpPost("preprocess/evaluate")]
    private ActionResult StartFrameEvaluationAsync(StartGenerationModel? model)
    {
        //TODO: Implement evaluation
        _logger.LogInformation($"Frame evaluation for {model!.JobID} has completed successfully.");
        return StatusCode(StatusCodes.Status200OK, new
        {
            statusCode = 200,
            jobStatus = "Completed Evaluation",
            selectedFrames = new[] { 1 },
            message = "Success: Frame evaluation completed successfully"
        });
    }

    /**
     * <summary>Starts the process of masking frames from the input video</summary>
     *
     * <param name="model">The generation model</param>
     *
     * <returns>ActionResult from the process</returns>
     *
     * <note>This is a blocking task as we should only be processing one thing at a time</note>
     */
    [HttpPost("preprocess/mask")]
    public ActionResult StartFrameMasking(StartGenerationModel? model)
    {
        try
        {
            if (model == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    jobStatus = "Failed Frame Masking",
                    message = "Error: There was no details provided to process."
                });
            }

            if (model.FilePath != null &&
                Directory.Exists(Path.Join(GetOutputPath(model.FilePath), model.MaskOutputLoc)) &&
                Directory.GetFiles(Path.Join(GetOutputPath(model.FilePath), model.MaskOutputLoc)).Length > 0)
            {
                // Output file full, masks already exist
                _logger.LogInformation($"Frame masking for {model.JobID} has completed successfully.");
                return StatusCode(StatusCodes.Status200OK, new
                {
                    statusCode = 200,
                    jobStatus = "Completed Masking",
                    message = "Success: Frames have been masked."
                });
            }

            if (string.IsNullOrEmpty(model?.OutputPath))
                if (model?.FilePath != null)
                    model!.OutputPath = GetOutputPath(model.FilePath);

            if (string.IsNullOrEmpty(model?.SubjectHint))
                model!.SubjectHint = "";

            _logger.LogInformation($"Starting frame masking for job: {model!.JobID}");
            Directory.CreateDirectory(model.OutputPath + model.MaskOutputLoc);

            var wslUser = _configuration.GetValue<string>("WslUser");
            var wslScriptPath = _configuration.GetValue<string>("WslScriptPath");
            var wslCondaEnv = _configuration.GetValue<string>("WslCondaEnv");
            var wslCmd = _configuration.GetValue<string>("WslStartCmd");

            string args = $"-d Ubuntu-20.04 -u {wslUser} sh -c \"cd \'{wslScriptPath!}\' && . ~/.bashrc && ~/anaconda3/bin/conda run -n {wslCondaEnv!} python ./gen_masks.py -p \'{GetWslPathFromWindowsPath(model.OutputPath!)}\' -m {model.SubjectHint}\"";
            _logger.LogInformation($"args: {args}");
            var startInfo = new ProcessStartInfo(fileName: wslCmd!, arguments: args);
            
            startInfo.CreateNoWindow = false;
            startInfo.UseShellExecute = true;
            startInfo.RedirectStandardOutput = false;
            startInfo.RedirectStandardError = false;

            var proc = Process.Start(startInfo);
            proc?.WaitForExit();

            _logger.LogInformation($"Frame masking for job: {model.JobID} has completed successfully.");
            return StatusCode(StatusCodes.Status200OK, new
            {
                statusCode = 200,
                jobStatus = "Completed Masking",
                message = "Success: Frames have been masked."
            });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                statusCode = 500,
                jobStatus = "Failed Frame Masking",
                message = "Error: There was an error when masking the frames of the input file."
            });
        }
        
    }
    
    /**
     * <summary> Checks if the file path contains a valid file and creates an output directory for generation</summary>
     *
     * <param name="model"> The job model to validate</param>
     *
     * <returns>A StatusResult representing the result of the method.</returns>
     */
    [HttpPost("preprocess/validate")]
    public ActionResult ValidFileCheck(StartGenerationModel? model)
    {
        if (model == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                statusCode = 500,
                jobStatus = "Failed Validation",
                message = "Error: No valid details provided"
            });
        }

        try
        {
            if (model.FilePath != null)
            {
                model.OutputPath = GetOutputPath(model.FilePath);
                if (!string.IsNullOrEmpty(model.OutputPath))
                {
                    Directory.CreateDirectory(model.OutputPath);
                    _logger.LogInformation(
                        $"Success: Valid file found and output directory created at path: {model.OutputPath}");
                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        statusCode = 200,
                        jobStatus = "Completed Validation",
                        message = $"Success: Valid file found and output directory created at path: {model.OutputPath}"
                    });
                }

                _logger.LogError($"Error: No valid file found at path: {model.FilePath}");
                return StatusCode(StatusCodes.Status404NotFound, new
                {
                    statusCode = 404,
                    jobStatus = "Failed Validation",
                    message = $"Error: No valid file found at path: {model.FilePath}"
                });
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                statusCode = 500,
                jobStatus = "Failed Validation",
                message = $"Error: {e.Message}"
            });
        }
        return StatusCode(StatusCodes.Status500InternalServerError, new
        {
            statusCode = 500,
            jobStatus = "Failed Validation",
            message = $"Error: Internal error"
        });
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


    private string GetWslPathFromWindowsPath(string windowsPath)
    {
        string fullWindowsPath = Path.GetFullPath(windowsPath);
        
        string driveLetter = char.ToLower(fullWindowsPath[0]).ToString();
        
        string remainingPath = fullWindowsPath.Substring(2).Replace(Path.DirectorySeparatorChar, '/');
        
        string wslPath = $"/mnt/it01{remainingPath}";

        return wslPath;
    }

}

