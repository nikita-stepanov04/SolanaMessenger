using Microsoft.AspNetCore.SignalR;
using SolanaMessenger.Application.Cryptography;

namespace SolanaMessenger.Web.Hubs
{
    public class HubUserIDProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User.FindFirst(JwtClaimType.UserID)!.Value;
        }
    }
}
