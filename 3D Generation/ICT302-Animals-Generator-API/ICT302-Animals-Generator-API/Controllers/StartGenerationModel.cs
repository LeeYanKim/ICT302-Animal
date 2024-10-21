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

public class StartGenerationJson
{
    public StartGenerationJson()
    {
        Token = null;
        JobID = null;
        FileName = null;
        OutputPath = null;
        SubjectHint = null;
        ModelPath = null;
        ModelVersion = null;
    }
    public StartGenerationJson(string token)
    {
        Token = token;
        JobID = null;
        FileName = null;
        OutputPath = null;
        SubjectHint = null;
        ModelPath = null;
        ModelVersion = null;
    }
    public StartGenerationJson(string token, Guid jobId, string fileName)
    {
        Token = token;
        JobID = jobId;
        FileName = fileName;
    }


    public string? Token { get; set; }
    public Guid? JobID { get; set; }
    public string? FileName { get; set; }

    public string? OutputPath { get; set; }
    public string? SubjectHint { get; set; }
    
    public string? ModelPath { get; set; }
    public int? ModelVersion { get; set; }
}

public class StartGenerationJsonConverter
{
    public static StartGenerationJson FromJson(JsonNode? json)
    {
        if(json == null)
            return new StartGenerationJson();
        
        var token = json["token"]?.ToString();
        var sguid = json["jobID"]?.ToString();
        var file = json["fileName"]?.ToString();
        
        if(string.IsNullOrEmpty(token))
            return new StartGenerationJson();
        
        if(string.IsNullOrEmpty(sguid))
            return new StartGenerationJson();
        
        if(string.IsNullOrEmpty(file))
            return new StartGenerationJson();
        
        return new StartGenerationJson(token, Guid.Parse(sguid), file);
    }
    
    public static StartGenerationJson? GetFromJson(IFormCollection form)
    {
        try
        {
            if (form.ContainsKey("StartGenerationJson"))
            {
                var values = new StartGenerationJson();
                var jsonData = form["StartGenerationJson"].ToString();
                
                var jsonDoc = JsonDocument.Parse(jsonData);
                
                if (jsonDoc.RootElement.TryGetProperty("token", out var tokenVal))
                {
                    Console.WriteLine("Token provided for the request");
                    values.Token = tokenVal.GetString();
                }
                if (jsonDoc.RootElement.TryGetProperty("jobId", out var jobIdVal))
                {
                    values.JobID = Guid.Parse(jobIdVal.GetString()!);
                }
                if (jsonDoc.RootElement.TryGetProperty("fileName", out var fileNameVal))
                {
                    values.FileName = fileNameVal.GetString();
                }
                if (jsonDoc.RootElement.TryGetProperty("subjectHint", out var subjectHintVal))
                {
                    values.SubjectHint = subjectHintVal.GetString();
                }
                if (jsonDoc.RootElement.TryGetProperty("modelPath", out var modelPathVal))
                {
                    values.ModelPath = modelPathVal.GetString();
                }
                if (jsonDoc.RootElement.TryGetProperty("modelVersion", out var modelVerVal))
                {
                    values.ModelVersion = modelVerVal.GetInt32();
                }
                
            }
            return null;    
        }
        catch (Exception e)
        {
            Console.WriteLine("Error: {0}", e.Message);
            return null;
        }
    }
}

