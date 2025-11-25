using Microsoft.AspNetCore.SignalR;

namespace SolanaMessenger.Web
{
    public class NotificationBase<THub>
        where THub : Hub
    {
        protected readonly IHubContext<THub> HubContext;

        public NotificationBase(IHubContext<THub> hubContext)
        {
            HubContext = hubContext;
        }
    }
}
