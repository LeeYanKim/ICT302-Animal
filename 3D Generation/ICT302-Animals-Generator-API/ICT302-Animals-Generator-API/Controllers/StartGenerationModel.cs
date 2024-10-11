namespace ICT302_Animals_Generator_API.Controllers;

public class StartGenerationModel
{
    public Guid JobID { get; set; }
    public string FilePath { get; set; }
    
    public string? SubjectHint { get; set; }
    
}

public enum JobStatus
{
    IncompleteData,
    Pending,
    PreparingFrames,
    CompleteFrames,
    FailedFramePreparation,
    PreparingFileValidation,
    CompleteFileValidation,
    FailedFileValidation,
    PreparingMasks,
    CompleteMasks,
    FailedMasks,
    PreparingEvaluation,
    CompleteEvaluation,
    FailedEvaluation,
    CompletedPreparing,
    Generating,
    CompleteGeneration,
    FailedGeneration,
    Failed,
    UnknownStatus
    
    
}

public class StatusResult(int statusCode, JobStatus statusDetail, string message)
{
    public int StatusCode { get; set; } = statusCode;
    public JobStatus StatusDetail { get; set; } = statusDetail;
    public string Message { get; set; } = message;
}