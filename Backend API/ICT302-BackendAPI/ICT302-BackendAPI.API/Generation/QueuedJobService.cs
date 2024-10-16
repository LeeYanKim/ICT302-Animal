using ICT302_BackendAPI.Database.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ICT302_BackendAPI.API.Generation;

public sealed class QueuedJobService(IBackgroundJobQueue taskQueue,
ILogger<QueuedJobService> logger) : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Starting Background job queue...");

        return ProcessTaskQueueAsync(stoppingToken);
    }

    private async Task ProcessTaskQueueAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                Func<CancellationToken, ValueTask> workItem =
                    await taskQueue.DequeueAsync(stoppingToken);

                await workItem(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Prevent throwing if stoppingToken was signaled
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred executing task work item.");
            }
        }
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Background job queue is stopping.");

        await base.StopAsync(stoppingToken);
    }
}