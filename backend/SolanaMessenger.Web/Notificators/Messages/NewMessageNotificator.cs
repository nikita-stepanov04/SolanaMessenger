using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Web.Hubs;

namespace SolanaMessenger.Web
{
    public class NewMessageNotificator 
        : NotificatorBase<ChatHub, IChatHub, MessageDTO>, INewMessageNotificator
    {
        public NewMessageNotificator(IHubContext<ChatHub, IChatHub> hubContext)
            : base(hubContext) { }

        protected override async Task NotifyAsync(MessageDTO message)
        {
            var chatID = message.ChatID.ToString();
            await HubContext.Clients
                .Group(chatID)
                .ReceiveMessage(message);
        }
    }
}
