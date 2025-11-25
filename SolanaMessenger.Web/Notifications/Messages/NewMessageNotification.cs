using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;
using SolanaMessenger.Domain.Entities;
using SolanaMessenger.Web.Hubs;

namespace SolanaMessenger.Web
{
    public class NewMessageNotification : NotificationBase<MessageHub>, INewMessageNotification
    {
        public NewMessageNotification(IHubContext<MessageHub> hubContext) 
            : base(hubContext) { }

        public void Notify(MessageData obj)
        {

        }
    }
}
