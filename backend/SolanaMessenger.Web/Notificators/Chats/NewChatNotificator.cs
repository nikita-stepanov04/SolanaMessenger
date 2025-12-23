using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Application.Notification;
using SolanaMessenger.Web.Hubs;
using System.Text.Json;

namespace SolanaMessenger.Web
{
    public class NewChatNotificator
        : NotificatorBase<ChatHub, IChatHub, ChatCreatedDTO>, INewChatNotificator
    {
        private readonly IMapper _mapper;

        public NewChatNotificator(
            IHubContext<ChatHub, IChatHub> hubContext,
            IMapper mapper)
            : base(hubContext)
        {
            _mapper = mapper;
        }

        protected override async Task NotifyAsync(ChatCreatedDTO chat)
        {
            var minDto = _mapper.Map<ChatMinimalDTO>(chat);
            await Task.Delay(1000);
            foreach(var id in chat.UserIDs)
            {
                await HubContext.Clients
                    .User(id.ToString())
                    .UserAddedToChat(minDto);
            };
            Thread.Sleep(10000);
        }
    }
}
