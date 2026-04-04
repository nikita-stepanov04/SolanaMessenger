namespace SolanaMessenger.Domain.Entities
{
    public class InvalidatedRefreshTokenData : EntityBase
    {
        public string TokenID { get; set; } = null!;
        public DateTime DateExpiration { get; set; }
    }
}
