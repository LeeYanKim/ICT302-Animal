using ICT302_BackendAPI.Database.Models;

namespace ICT302_BackendAPI.API.Generation;

public interface IBackgroundJobQueue
{
    ValueTask QueueBackgroundWorkItemAsync(
        Func<CancellationToken, ValueTask> workItem);

    ValueTask<Func<CancellationToken, ValueTask>> DequeueAsync(
        CancellationToken cancellationToken);
}