using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace SolanaMessenger.Application.Cryptography
{
    public static class Jwt
    {
        public static TokenValidationParameters GetTokenValidationParameters(string securityKey, bool validateLifetime = true)
        {
            return new TokenValidationParameters
            {
                ClockSkew = TimeSpan.Zero,
                ValidateIssuer = false,
                ValidateLifetime = validateLifetime,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey))
            };
        }
    }

    public static class JwtClaimType
    {
        public const string Login = "login";
        public const string TokenID = "tokenId";
        public const string UserID = "userId";
    }
}
