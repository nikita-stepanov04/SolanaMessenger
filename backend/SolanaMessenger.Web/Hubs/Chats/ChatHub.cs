using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Web.Identity;

namespace SolanaMessenger.Web.Hubs
{
    [Authorize(Policy = Policies.AuthorizedAny)]
    public class ChatHub : Hub
    {
    }
}
