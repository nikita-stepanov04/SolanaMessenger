using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;

namespace SolanaMessenger.Web
{
    public abstract class NotificatorBase<THub, THubType, TNotificationType>
        : INotificator<TNotificationType>
        where THub : Hub<THubType>
        where THubType : class
        where TNotificationType : class
    {
        protected readonly IHubContext<THub, THubType> HubContext;
        protected readonly ILogger _logger;

        public NotificatorBase(
            IHubContext<THub, THubType> hubContext,
            ILoggerFactory loggerFactory)
        {
            HubContext = hubContext;
            _logger = loggerFactory.CreateLogger<INotificator<TNotificationType>>();
        }

        public void Notify(TNotificationType notification)
        {
            Task.Run(async () =>
            {
                try
                {
                    await NotifyAsync(notification);
                }
                catch (Exception ex)
                {
                    _logger.LogCritical("Exception happened while invoking notification of type {type}\n{ex}",
                        this.GetType().Name, ex);
                }
            });
        }

        protected abstract Task NotifyAsync(TNotificationType notification);
    }
}
