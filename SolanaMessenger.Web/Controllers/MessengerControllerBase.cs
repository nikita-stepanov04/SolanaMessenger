using Microsoft.AspNetCore.Mvc;
using SolanaMessenger.Application.Cryptography;
using SolanaMessenger.Web.Filters;

namespace SolanaMessenger.Web.Controllers
{
    [ValidateModel]
    [Produces("application/json")]
    public class MessengerControllerBase : ControllerBase
    {
        public string AccessToken => GetAccessTokenFromRequest();

        private string GetAccessTokenFromRequest()
        {
            string header = HttpContext.Request.Headers["Authorization"]!;
            return header.Substring("Bearer ".Length).Trim();
        }

        public Guid UserID => Guid.Parse(User.FindFirst(JwtClaimType.UserID)!.Value);
        public string UserLogin => User.FindFirst(JwtClaimType.Login)!.Value;
    }
}
