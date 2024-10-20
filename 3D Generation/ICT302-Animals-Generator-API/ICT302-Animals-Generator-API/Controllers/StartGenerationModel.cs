using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace ICT302_Animals_Generator_API.Controllers;

public class StartGenerationModel
{
    public StartGenerationJson? StartGenerationJson { get; set; }
    public IFormFile? InputFile {get; set;}

    public readonly string ImageOutputLoc = "/images";
    
    public readonly string MaskOutputLoc = "/masks";
    
    public readonly string GenOutputLoc = "/gen";

}

public class StartGenerationJson(string token, Guid jobId, string fileName)
{
    public string? Token { get; set; } = token;
    public Guid? JobID { get; set; } = jobId;
    public string? FileName { get; set; } = fileName;

    public string? OutputPath { get; set; }
    public string? SubjectHint { get; set; }
    
    public string? ModelPath { get; set; }
    public int? ModelVersion { get; set; }
}

public class StartGenerationJsonConverter
{
    public static StartGenerationJson FromJson(JsonNode json)
    {
        string? token = json["token"]?.ToString();
        string? sguid = json["jobID"]?.ToString();
        string? file = json["filePath"]?.ToString();
        
        return new StartGenerationJson(token, Guid.Parse(sguid), file);
    }
}