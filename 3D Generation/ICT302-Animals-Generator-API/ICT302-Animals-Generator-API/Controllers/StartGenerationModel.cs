namespace ICT302_Animals_Generator_API.Controllers;

public class StartGenerationModel
{
    public Guid? JobID { get; set; }
    public string? FilePath { get; set; }
    
    public string? OutputPath { get; set; }
    
    public string? SubjectHint { get; set; }
    
    public string? ModelPath { get; set; }
    
    public int? ModelVersion { get; set; }

    public readonly string ImageOutputLoc = "/images";
    public readonly string MaskOutputLoc = "/masks";
    public readonly string GenOutputLoc = "/gen";

}
