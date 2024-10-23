using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices.ComTypes;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Aspose.ThreeD;
using ICT302_Animals_Generator_API.Util;
using Microsoft.Extensions.Primitives;
using System.Web;


namespace ICT302_Animals_Generator_API.Controllers;

[ApiController]
[Route("api/gen")]
public class GenerationController : ControllerBase
{

    private readonly ILogger<GenerationController> _logger;
    private readonly IConfiguration _configuration;
    private readonly SecurityMaster _securityMaster;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public GenerationController(ILogger<GenerationController> logger, IConfiguration configuration, SecurityMaster securityMaster, IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        _configuration = configuration;
        _securityMaster = securityMaster;
        _webHostEnvironment = webHostEnvironment;
    }

    private ObjectResult CheckForValidRequestData(StartGenerationModel? model)
    {
        // Null Check
        if (model == null)
        {
            _logger.LogInformation("Error: Unauthorized token provided.");
            return StatusCode(StatusCodes.Status418ImATeapot, new
            {
                statusCode = 418,
                jobStatus = "Unauthorized",
                message = "Error: Unauthorized token provided for request"
            });
        }
        
        model.StartGenerationJson = GetFromJson();
        
        // Auth Check
        if(string.IsNullOrEmpty(model.StartGenerationJson.Token) || _securityMaster.IsRequestAuthorized(model.StartGenerationJson.Token) == StatusCodes.Status418ImATeapot)
        {
            _logger.LogInformation("Error: Unauthorized token provided.");
            return StatusCode(StatusCodes.Status418ImATeapot, new
            {
                statusCode = 418,
                jobStatus = "Unauthorized",
                message = "Error: Unauthorized token provided for request"
            });
        }
        
        //FilePath check
        if (string.IsNullOrEmpty(model.StartGenerationJson.FileName))
        {
            _logger.LogInformation("Error: No details provided for generation.");
            return StatusCode(StatusCodes.Status400BadRequest, new
            {
                statusCode = 400,
                jobStatus = "Failed",
                message = "Error: No FilePath provided"
            });
        }
        
        // JobID Check
        if (model.StartGenerationJson.JobID == Guid.Empty)
        {
            _logger.LogInformation("Error: No JobID provided");
            return StatusCode(StatusCodes.Status400BadRequest, new
            {
                statusCode = 400,
                jobStatus = "Failed",
                message = "Error: No JobID provided"
            });
        }
        
        return StatusCode(StatusCodes.Status200OK, new
        {
            statusCode = 200,
            jobStatus = "Success",
            message = "Success: All required data is provided"
        });
    }
    
    [HttpPost("generate/bite")]
    public async Task<ActionResult> StartGenerationAsync([FromForm] StartGenerationModel? model)
    {
        try
        {
            var checks = CheckForValidRequestData(model);
            if(checks.StatusCode == StatusCodes.Status418ImATeapot)
                return CheckForValidRequestData(model);
            
            
            if (Directory.Exists(Path.Join(GetOutputPath(model!.StartGenerationJson!.JobID!), model.GenOutputLoc)) &&
                Directory.GetFiles(Path.Join(GetOutputPath(model.StartGenerationJson.JobID!), model.GenOutputLoc)).Length > 0)
            {
                // Output file full, masks already exist
                _logger.LogInformation($"Generation for job {model.StartGenerationJson.JobID} has completed successfully.");
                return StatusCode(StatusCodes.Status200OK, new
                {
                    statusCode = 200,
                    jobStatus = "Completed Generation",
                    message = "Success: 3D model generation has completed successfully."
                });
            }

            if (string.IsNullOrEmpty(model?.StartGenerationJson.OutputPath))
                model!.StartGenerationJson.OutputPath = GetOutputPath(model.StartGenerationJson.JobID!);
            
            _logger.LogInformation($"Starting Bite Generation for job: {model!.StartGenerationJson.JobID}");
            Directory.CreateDirectory(model.StartGenerationJson.OutputPath + model.GenOutputLoc);

            // Enable or disable in config for debug testing
            var genEnabled = _configuration.GetValue<bool>("3DGenEnabled");
            if (!genEnabled)
            {
                _logger.LogInformation($"3D generation for {model.StartGenerationJson.JobID} is disabled");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    jobStatus = "Generation Disabled",
                    message = "Success: Model has been generated successfully."
                });
            }
            
            //move frame to bite input'
            var userHomePath = _configuration.GetValue<string>("LinuxHomeUserPath");
            var biteInput = _configuration.GetValue<string>("BiteInputPath");
            var inputFramePath = Path.Join(model.StartGenerationJson.OutputPath + model.ImageOutputLoc, "0001.png");
            var outputFramePath = Path.Join(userHomePath, biteInput, "0001.png");
            _logger.LogInformation("Moving image frame from {0} to {1}", inputFramePath, outputFramePath);
            System.IO.File.Copy(inputFramePath, outputFramePath, true);
            
            _logger.LogInformation($"Starting 3D generation for job: {model.StartGenerationJson.JobID}");
            Directory.CreateDirectory(model.StartGenerationJson.OutputPath + model.GenOutputLoc);

            string? wslUser;
            string? scriptPath;
            string? condaEnv;
            string? startCmd;
            string? biteCmd;
            string? args = null;
            string? workingDir = null;
            
            if (OperatingSystem.IsWindows())
            {
                // WSL
                wslUser = _configuration.GetValue<string>("WslUser") ?? null;
                scriptPath = _configuration.GetValue<string>("WslScriptPath") ?? null;
                condaEnv = _configuration.GetValue<string>("WslCondaEnv") ?? null;
                startCmd = _configuration.GetValue<string>("WslStartCmd") ?? null;
                biteCmd = _configuration.GetValue<string>("BitePythonCmd") ?? null;
                if(!string.IsNullOrEmpty(wslUser) && !string.IsNullOrEmpty(scriptPath) && !string.IsNullOrEmpty(condaEnv) && !string.IsNullOrEmpty(startCmd) && !string.IsNullOrEmpty(biteCmd))
                    args = $"-c \"cd {scriptPath} && . ~/.bashrc && ~/anaconda3/bin/conda run -n {condaEnv} python {userHomePath + biteCmd} {model.StartGenerationJson.JobID}\"";
            }
            else
            {
                // Linux
                wslUser = _configuration.GetValue<string>("WslUser") ?? null;
                scriptPath = _configuration.GetValue<string>("ScriptPath") ?? null;
                condaEnv = _configuration.GetValue<string>("CondaEnv") ?? null;
                startCmd = _configuration.GetValue<string>("LinuxStartCmd") ?? null;
                biteCmd = _configuration.GetValue<string>("BitePythonCmd") ?? null;
                if (!string.IsNullOrEmpty(wslUser) && !string.IsNullOrEmpty(scriptPath) &&
                    !string.IsNullOrEmpty(condaEnv) && !string.IsNullOrEmpty(startCmd) &&
                    !string.IsNullOrEmpty(biteCmd))
                {
                    args = $" run -n {condaEnv} python {userHomePath + biteCmd} {model.StartGenerationJson.JobID}";
                    workingDir = Path.Join(userHomePath, scriptPath);
                }
            }

            if (string.IsNullOrEmpty(args))
            {
                throw new Exception($"Error in creating python arguments from config. Are the required arguments in the config file?");
            }
            
            _logger.LogInformation("Starting BITE with following params:\n\tCommand:\n\t\t{cmd}\n\tScripts Path:\n\t\t{scp}\n\tConda Env:\n\t\t{env}\n\tBite Script Cmd:\n\t\t{bite}\n\tFinal Cmd:\n\t\t{args}", startCmd, scriptPath, condaEnv, biteCmd, args);
            var startInfo = new ProcessStartInfo(fileName: $"{userHomePath}anaconda3/bin/conda", arguments: args)
            {
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                WorkingDirectory = workingDir
            };
            
            var proc = Process.Start(startInfo);
            
            try
            {
                await proc?.WaitForExitAsync()!;

                if (proc.HasExited)
                {
                    _logger.LogInformation($"Process exited with code {proc.ExitCode}");

                    if (proc.ExitCode == 0)
                    {
                        var biteOutput = _configuration.GetValue<string>("BiteResultPath");
                        var genFolderName = "test_ImgCropList_" + model.StartGenerationJson.JobID;
                        var inputModelFile = Path.Join(userHomePath + biteOutput, genFolderName, "0001_res_e150.obj");
                        var outputModelFile = Path.Join(model.StartGenerationJson.OutputPath + model.GenOutputLoc, "bite_output.obj");
                        _logger.LogInformation("Moving BITE generated model from {in} to {out}", inputModelFile, outputModelFile);
                        System.IO.File.Copy(inputModelFile, outputModelFile, true);
                        
                        
                        //remove frame to bite input'
                        outputFramePath = Path.Join(userHomePath, biteInput, "0001.png");
                        _logger.LogInformation("Cleaning BITE image inputs in path {path}", outputFramePath);
                        System.IO.File.Delete(outputFramePath);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError("There was an error when starting BITE with error: {err}", e.Message);
                throw;
            }
            
            _logger.LogInformation($"3D generation for {model.StartGenerationJson.JobID} has completed successfully.");
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
    public ActionResult StartGlbConversionAsync([FromForm] StartGenerationModel? model)
    {
        try
        {
            var checks = CheckForValidRequestData(model);
            if(checks.StatusCode == StatusCodes.Status418ImATeapot)
                return CheckForValidRequestData(model);

            if (string.IsNullOrEmpty(model?.StartGenerationJson!.OutputPath))
                if (model?.StartGenerationJson!.FileName != null)
                    model!.StartGenerationJson.OutputPath = GetOutputPath(model.StartGenerationJson.JobID);

            _logger.LogInformation($"Starting GLB conversion for job: {model!.StartGenerationJson!.JobID}");
            
            
            // Enable or disable in config for debug testing
            var convertEnabled = _configuration.GetValue<bool>("GLBConvertEnabled");
            if (!convertEnabled)
            {
                _logger.LogInformation($"GLB conversion for job: {model.StartGenerationJson.JobID} is disabled");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = 500,
                    jobStatus = "Not Converted",
                    message = "Success: GLB conversion completed successfully"
                });
            }
            
            model.StartGenerationJson.OutputPath = GetOutputPath(model.StartGenerationJson.JobID);
            var scene = Scene.FromFile(Path.Join(model!.StartGenerationJson.OutputPath + model.GenOutputLoc, "bite_output.obj"));
            var root = model.StartGenerationJson.OutputPath;
            scene.Save(Path.Join(root, model.StartGenerationJson.JobID + ".glb"));

            _logger.LogInformation($"GLB conversion for job: {model.StartGenerationJson.JobID} has completed successfully.");
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
    public ActionResult StartCleanUpAsync([FromForm] StartGenerationModel? model)
    {
        try
        {
            var checks = CheckForValidRequestData(model);
            if(checks.StatusCode == StatusCodes.Status418ImATeapot)
                return CheckForValidRequestData(model);

            if (string.IsNullOrEmpty(model?.StartGenerationJson!.OutputPath))
                if (model?.StartGenerationJson!.FileName != null)
                    model!.StartGenerationJson.OutputPath = GetOutputPath(model.StartGenerationJson.JobID);

            _logger.LogInformation($"Starting file clean up for job: {model?.StartGenerationJson!.JobID}");

            //Leave the output folder on the system with just the model file
            if (Directory.Exists(Path.Join(model!.StartGenerationJson!.OutputPath, model.ImageOutputLoc)))
            {
                Directory.Delete(Path.Join(model!.StartGenerationJson.OutputPath, model.ImageOutputLoc), true);
            }
            
            if (Directory.Exists(Path.Join(model!.StartGenerationJson.OutputPath, model.MaskOutputLoc)))
            {
                Directory.Delete(Path.Join(model!.StartGenerationJson.OutputPath, model.MaskOutputLoc), true);
            }

            if (Directory.Exists(Path.Join(model!.StartGenerationJson.OutputPath, model.GenOutputLoc)))
            {
                Directory.Delete(Path.Join(model!.StartGenerationJson.OutputPath, model.GenOutputLoc), true);
            }

            if (Path.Exists(Path.Join(model!.StartGenerationJson.OutputPath, model.StartGenerationJson.FileName)))
            {
                System.IO.File.Delete(Path.Join(model!.StartGenerationJson.OutputPath, model.StartGenerationJson.FileName));
            }
            
            _logger.LogInformation($"File clean up for job: {model.StartGenerationJson.JobID} has completed successfully.");
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
    public async Task<ActionResult> StartFrameSplittingAsync([FromForm] StartGenerationModel? model)
    {
        try
        {
            var checks = CheckForValidRequestData(model);
            if(checks.StatusCode == StatusCodes.Status418ImATeapot)
                return CheckForValidRequestData(model);
            
            if (model!.StartGenerationJson!.FileName != null && Directory.Exists(Path.Join(GetOutputPath(model.StartGenerationJson.JobID), model.ImageOutputLoc)) && Directory.GetFiles(Path.Join(GetOutputPath(model.StartGenerationJson.JobID), model.ImageOutputLoc)).Length > 0)
            {
                // Output folder full, images already exist
                _logger.LogInformation($"Frame splitting for {model.StartGenerationJson.JobID} has completed successfully.");
                return StatusCode(StatusCodes.Status200OK, new
                {
                    statusCode = 200,
                    jobStatus = "Completed Splitting",
                    message = "Success: Frames have been split."
                });
            }

            if (string.IsNullOrEmpty(model?.StartGenerationJson.OutputPath))
                if (model?.StartGenerationJson.FileName != null)
                    model!.StartGenerationJson.OutputPath = GetOutputPath(model.StartGenerationJson.JobID);

            _logger.LogInformation($"Starting frame splitting for {model!.StartGenerationJson.JobID}");
            Directory.CreateDirectory(model!.StartGenerationJson.OutputPath + model.ImageOutputLoc);

            var ffmpeg = _configuration.GetValue<string>("Ffmpeg_bin_path");
            
            var outFormat = "/%0004d.png";
            var startInfo = new ProcessStartInfo(fileName: ffmpeg!,
                arguments: $"-i {model!.StartGenerationJson.OutputPath + "/" + model.StartGenerationJson.FileName} -filter:v fps=1 {model!.StartGenerationJson.OutputPath + model.ImageOutputLoc + outFormat}")
            {
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };
            var proc = Process.Start(startInfo);
            if (proc != null) await proc.WaitForExitAsync().ConfigureAwait(false);

            _logger.LogInformation($"Frame splitting for {model.StartGenerationJson.JobID} has completed successfully.");
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
    private ActionResult StartFrameEvaluationAsync([FromForm] StartGenerationModel? model)
    {
        //TODO: Implement frame eval. This is a code stub and is ready for functionality to be added.
        
        var checks = CheckForValidRequestData(model);
        if(checks.StatusCode == StatusCodes.Status418ImATeapot)
            return checks;
        
        
        _logger.LogInformation($"Frame evaluation for {model!.StartGenerationJson!.JobID} has completed successfully.");
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
    public ActionResult StartFrameMasking([FromForm] StartGenerationModel? model)
    {
        try
        {
            var checks = CheckForValidRequestData(model);
            if(checks.StatusCode == StatusCodes.Status418ImATeapot)
                return checks;

            if (model!.StartGenerationJson!.FileName != null &&
                Directory.Exists(Path.Join(GetOutputPath(model.StartGenerationJson.JobID), model.MaskOutputLoc)) &&
                Directory.GetFiles(Path.Join(GetOutputPath(model.StartGenerationJson.JobID), model.MaskOutputLoc)).Length > 0)
            {
                // Output file full, masks already exist
                _logger.LogInformation($"Frame masking for {model.StartGenerationJson.JobID} has completed successfully.");
                return StatusCode(StatusCodes.Status200OK, new
                {
                    statusCode = 200,
                    jobStatus = "Completed Masking",
                    message = "Success: Frames have been masked."
                });
            }

            if (string.IsNullOrEmpty(model?.StartGenerationJson.OutputPath))
                if (model?.StartGenerationJson.FileName != null)
                    model!.StartGenerationJson.OutputPath = GetOutputPath(model.StartGenerationJson.JobID);

            if (string.IsNullOrEmpty(model?.StartGenerationJson.SubjectHint))
                model!.StartGenerationJson.SubjectHint = "";

            _logger.LogInformation($"Starting frame masking for job: {model!.StartGenerationJson.JobID}");
            Directory.CreateDirectory(model.StartGenerationJson.OutputPath + model.MaskOutputLoc);

            var wslUser = _configuration.GetValue<string>("WslUser");
            var wslScriptPath = _configuration.GetValue<string>("WslScriptPath");
            var wslCondaEnv = _configuration.GetValue<string>("WslCondaEnv");
            var wslCmd = _configuration.GetValue<string>("WslStartCmd");

            string args = $"-d Ubuntu-20.04 -u {wslUser} sh -c \"cd \'{wslScriptPath!}\' && . ~/.bashrc && ~/anaconda3/bin/conda run -n {wslCondaEnv!} python ./gen_masks.py -p \'{GetWslPathFromWindowsPath(model.StartGenerationJson.OutputPath!)}\' -m {model.StartGenerationJson.SubjectHint}\"";
            _logger.LogInformation($"args: {args}");
            var startInfo = new ProcessStartInfo(fileName: wslCmd!, arguments: args);
            
            startInfo.CreateNoWindow = false;
            startInfo.UseShellExecute = true;
            startInfo.RedirectStandardOutput = false;
            startInfo.RedirectStandardError = false;

            var proc = Process.Start(startInfo);
            proc?.WaitForExit();

            _logger.LogInformation($"Frame masking for job: {model.StartGenerationJson.JobID} has completed successfully.");
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
    public async Task<ActionResult> ValidFileCheck([FromForm] StartGenerationModel? model)
    {
        try
        {
            var checks = CheckForValidRequestData(model);
            if(checks.StatusCode == StatusCodes.Status418ImATeapot)
                return checks;
            
            model!.StartGenerationJson!.OutputPath = GetOutputPath(model.StartGenerationJson.JobID!);
            if (!string.IsNullOrEmpty(model.StartGenerationJson.OutputPath))
            {
                Directory.CreateDirectory(model.StartGenerationJson.OutputPath);
                _logger.LogInformation(
                    $"Success: Valid output directory created at path: {model.StartGenerationJson.OutputPath}");

                if (model.InputFile != null)
                {
                    using (var fileStream = new FileStream(model.StartGenerationJson.OutputPath + "/" + model.StartGenerationJson.FileName, FileMode.Create))
                    {
                        await model.InputFile.CopyToAsync(fileStream);
                    }
                    
                    _logger.LogInformation(
                        $"Success: File was saved to output directory");
                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        statusCode = 200,
                        jobStatus = "Completed Validation",
                        message = $"Success: Valid output directory created at path: {model.StartGenerationJson.OutputPath} and input file saved"
                    });
                }
                
                return StatusCode(StatusCodes.Status200OK, new
                {
                    statusCode = 200,
                    jobStatus = "Completed Validation",
                    message = $"Success: Valid output directory created at path: {model.StartGenerationJson.OutputPath}"
                });
            }

            _logger.LogError($"Error: No valid file found at path: {model.StartGenerationJson.FileName}");
            return StatusCode(StatusCodes.Status404NotFound, new
            {
                statusCode = 404,
                jobStatus = "Failed Validation",
                message = $"Error: No valid file found at path: {model.StartGenerationJson.FileName}"
            });
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
    }

    /**
     * <summary> Gets the output path for generation. </summary>
     *
     * <param name="jobId"> The jobID of the file being generated</param>
     *
     * <returns>Output path as string or null if an error occurs.</returns>
     */
    private string? GetOutputPath(Guid? jobId)
    {
        var outputRoot = _configuration.GetValue<string>("OutputRootFolder");
        var userHome = _configuration.GetValue<string>("LinuxHomeUserPath");
        var path = Path.Join(userHome, outputRoot, "job_" + jobId.ToString()).Replace("\\", "/");
        _logger.LogInformation("Output path: {0}", path);
        return jobId == null ? null : path;
    }

    private StartGenerationJson GetFromJson()
    {
        HttpContext.Request.Form.TryGetValue("StartGenerationJson", out var data);
        var j = JsonNode.Parse(data!);
        var jj = StartGenerationJsonConverter.FromJson(j);
        jj.OutputPath = GetOutputPath(jj.JobID!);
        return jj;
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

