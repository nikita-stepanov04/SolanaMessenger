using Microsoft.AspNetCore.SignalR;

namespace SolanaMessenger.Web
{
    public class NotificationBase<THub, THubType>
        where THub : Hub<THubType>
        where THubType : class
    {
        protected readonly IHubContext<THub, THubType> HubContext;

        public NotificationBase(IHubContext<THub, THubType> hubContext)
        {
            HubContext = hubContext;
        }
    }
}
