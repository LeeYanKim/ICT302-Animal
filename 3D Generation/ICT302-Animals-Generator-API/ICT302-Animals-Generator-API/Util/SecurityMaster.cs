namespace ICT302_Animals_Generator_API.Util;

public sealed class SecurityMaster
{
    private readonly ILogger<SecurityMaster> _logger;

    private readonly string? _internalAuthToken;

    public SecurityMaster(ILogger<SecurityMaster> logger, IConfiguration configuration)
    {
        _logger = logger;

        _internalAuthToken = configuration["AuthToken"] ?? "";
    }
    
    /**
     * <summary>Checks the internal allowed token returns the result if the provided token matches</summary>
     *
     * <param name="token">The token string to compare</param>
     *
     * <returns>True if valid or false if invalid</returns>
     */
    private bool IsTokenValid(string token)
    {
        if(string.IsNullOrEmpty(_internalAuthToken))
            _logger.LogCritical("No auth token provided in configuration");
        return string.Equals(_internalAuthToken, token);
    }


    /**
     * <summary>Checks if the request is Authorized</summary>
     *
     * <param name="token">The token string to compare</param>
     *
     * <returns>Http 200 Ok if authorized or Http 418 I'm a Teapot if unauthorized</returns>
     */
    public int IsRequestAuthorized(string token)
    {
        if(IsTokenValid(token))
            return StatusCodes.Status200OK; // Request is Authorized
        
        return StatusCodes.Status418ImATeapot; // I'm a Teapot
    }
}