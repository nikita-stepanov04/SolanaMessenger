using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application
{
    public class JwtSettings
    {
        [Required] public string AccessTokenKey { get; set; } = null!;
        [Required] public string RefreshTokenKey { get; set; } = null!;
        [Required] public int AccessTokenExpirationMinutes { get; set; }
        [Required] public int RefreshTokenExpirationDays { get; set; }
    }
}
