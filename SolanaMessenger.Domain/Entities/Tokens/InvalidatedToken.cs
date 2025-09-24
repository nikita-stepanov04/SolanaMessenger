namespace SolanaMessenger.Domain.Entities
{
    public class InvalidatedToken : EntityBase
    {
        public string TokenID { get; set; } = null!;
        public DateTime DateExpiration { get; set; }
    }
}
