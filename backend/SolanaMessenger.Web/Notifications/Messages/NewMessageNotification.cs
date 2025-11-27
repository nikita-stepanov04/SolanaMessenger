using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Web.Hubs;

namespace SolanaMessenger.Web
{
    public class NewMessageNotification 
        : NotificationBase<MessageHub, IMessageHub>, INewMessageNotificator
    {
        public NewMessageNotification(IHubContext<MessageHub, IMessageHub> hubContext)
            : base(hubContext) { }

        public async Task NotifyAsync(MessageDTO message)
        {
            var chatID = message.ChatID.ToString();
            await HubContext.Clients
                .Group(chatID)
                .ReceiveMessage(message);
        }
    }
}
