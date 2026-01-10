using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Web.Hubs;

namespace SolanaMessenger.Web
{
    public class NewMessageNotificator(IServiceScopeFactory serviceScopeFactory)
        : NotificatorBase<ChatHub, MessageDTO>(serviceScopeFactory), INewMessageNotificator
    {
        const string EVENT_NAME = "receiveMessage";

        protected override async Task NotifyAsync(MessageDTO message, IServiceProvider services)
        {
            var chatBS = services.GetRequiredService<IChatBS>();
            var chatUserIDs = await chatBS.GetChatUserIDsAsync(message.ChatID);

            foreach (var id in chatUserIDs.Except([message.UserID]))
            {
                await HubContext.Clients
                    .User(id.ToString())
                    .SendAsync(EVENT_NAME, new { message });
            }
        }
    }
}
