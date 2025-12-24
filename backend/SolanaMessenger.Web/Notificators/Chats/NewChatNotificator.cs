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
            ILoggerFactory loggerFactory,
            IMapper mapper)
            : base(hubContext, loggerFactory)
        {
            _mapper = mapper;
        }

        protected override async Task NotifyAsync(ChatCreatedDTO chat)
        {
            var minDto = _mapper.Map<ChatMinimalDTO>(chat);
            foreach(var id in chat.UserIDs)
            {
                await HubContext.Clients
                    .User(id.ToString())
                    .UserAddedToChat(minDto);
            };
        }
    }
}
