using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;

namespace SolanaMessenger.Web
{
    public abstract class NotificatorBase<THub, TNotificationType>
        : INotificator<TNotificationType>
        where THub : Hub
        where TNotificationType : class
    {
        protected IServiceScopeFactory ServiceScopeFactory;
        protected IHubContext<THub> HubContext;
        protected ILogger Logger;

        public NotificatorBase(IServiceScopeFactory serviceScopeFactory)
        {
            ServiceScopeFactory = serviceScopeFactory;
        }

        public void Notify(TNotificationType notification)
        {
            Task.Run(async () =>
            {
                var services = ServiceScopeFactory.CreateScope().ServiceProvider;
                try
                {
                    HubContext = services.GetRequiredService<IHubContext<THub>>();
                    Logger = services
                        .GetRequiredService<ILoggerFactory>()
                        .CreateLogger<INotificator<TNotificationType>>();

                    await NotifyAsync(notification, services);
                }
                catch (Exception ex)
                {
                    Logger.LogCritical("Exception happened while invoking notification of type {type}\n{ex}",
                        this.GetType().Name, ex);
                }
            });
        }

        protected abstract Task NotifyAsync(TNotificationType notification, IServiceProvider services);
    }
}
