using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;
using SolanaMessenger.Web.Identity;

namespace SolanaMessenger.Web.Hubs
{
    [Authorize(Policy = Policies.AuthorizedAny)]
    public class MessageHub : Hub<IMessageHub>
    {
        private const string CHAT_ID = "chatID";

        private readonly IChatBS _chatBS;

        public MessageHub(IChatBS chatBS)
        {
            _chatBS = chatBS;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext()!;

            var userID = Guid.Parse(Context.UserIdentifier!);
            var parseRes = Guid.TryParse(httpContext.Request.Query[CHAT_ID], out var chatID);

            if (!parseRes)
                throw new HubException("chatID is not specified");

            var getChatRes = await _chatBS.GetByChatIDForUserAsync(chatID, userID);

            if (getChatRes.HasError)
                throw new HubException(getChatRes.ErrorMessage);

            await Groups.AddToGroupAsync(Context.ConnectionId, chatID.ToString());
        }
    }
}
