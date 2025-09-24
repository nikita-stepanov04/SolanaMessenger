using Microsoft.AspNetCore.Mvc;
using SolanaMessenger.Web.Filters;

namespace SolanaMessenger.Web.Controllers
{
    [ValidateModel]
    public class MessengerControllerBase : ControllerBase
    {
        public string AccessToken => GetAccessTokenFromRequest();
        private string GetAccessTokenFromRequest()
        {
            string header = HttpContext.Request.Headers["Authorization"]!;
            return header.Substring("Bearer ".Length).Trim();
        }
    }
}
