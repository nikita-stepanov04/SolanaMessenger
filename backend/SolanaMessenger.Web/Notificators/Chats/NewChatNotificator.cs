using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Application.Notification;
using SolanaMessenger.Web.Hubs;

namespace SolanaMessenger.Web
{
    public class NewChatNotificator(IServiceScopeFactory serviceScopeFactory)
        : NotificatorBase<ChatHub, ChatCreatedDTO>(serviceScopeFactory), INewChatNotificator
    {
        const string EVENT_NAME = "userAddedToChat";

        protected override async Task NotifyAsync(ChatCreatedDTO chat, IServiceProvider services)
        {
            var mapper = services.GetRequiredService<IMapper>();
            var minDto = mapper.Map<ChatMinimalDTO>(chat);

            foreach (var id in chat.UserIDs)
            {
                await HubContext.Clients
                    .User(id.ToString())
                    .SendAsync(EVENT_NAME, new { chat = minDto });
            }
        }
    }
}
