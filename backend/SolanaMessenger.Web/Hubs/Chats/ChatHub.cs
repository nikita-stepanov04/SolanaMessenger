using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application;
using SolanaMessenger.Web.Identity;

namespace SolanaMessenger.Web.Hubs
{
    [Authorize(Policy = Policies.AuthorizedAny)]
    public class ChatHub : Hub<IChatHub>
    {
        private readonly IChatBS _chatBS;

        public ChatHub(IChatBS chatBS)
        {
            _chatBS = chatBS;
        }

        public override Task OnConnectedAsync()
        {
            Console.WriteLine("connected");
            return Task.CompletedTask;
        }

        [HubMethodName("connectToChat")]
        public async Task ConnectToChatAsync(Guid chatID)
        {
            var userID = Guid.Parse(Context.UserIdentifier!);
            var getChatRes = await _chatBS.GetByChatIDForUserAsync(chatID, userID);

            if (getChatRes.HasError)
                throw new HubException(getChatRes.ErrorMessage);

            await Groups.AddToGroupAsync(Context.ConnectionId, chatID.ToString());
        }

        [HubMethodName("disconnectFromChat")]
        public async Task DisconnectFromChatAsync(Guid chatID)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatID.ToString());
        }
    }
}
