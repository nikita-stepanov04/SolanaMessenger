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

        public NotificatorBase(IHubContext<THub, THubType> hubContext)
        {
            HubContext = hubContext;
        }

        public void Notify(TNotificationType notification)
        {
            Task.Run(async () =>
            {
                try
                {
                    Console.WriteLine("\n\n\nbefore\n\n\n");
                    await NotifyAsync(notification);
                    Console.WriteLine("\n\n\nafter\n\n\n");
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            });
        }

        protected abstract Task NotifyAsync(TNotificationType notification);
    }
}
