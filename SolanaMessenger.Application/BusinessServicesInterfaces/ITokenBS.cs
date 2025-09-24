using SolanaMessenger.Application.Cryptography;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SolanaMessenger.Application.BusinessServicesInterfaces
{
    public interface ITokenBS
    {
        string GenerateAccessToken(UserDTO user);
        string GenerateRefreshToken();
        IEnumerable<Claim>? ValidateAccessTokenForRefresh(string token);
        IEnumerable<Claim>? ValidateRefreshTokenForRefresh(string token);
        Task<bool> RevokeToken(string token);
        Task<InvalidatedToken?> GetByIDAsync(long id);
        Task<bool> IsTokenRevokedAsync(string token);
        Task<bool> IsTokenRevokedAsync(JwtSecurityToken jwtToken);
    }
}
