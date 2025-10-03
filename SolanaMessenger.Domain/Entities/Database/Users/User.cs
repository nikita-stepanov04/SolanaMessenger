namespace SolanaMessenger.Domain.Entities
{
    public class User : BlockchainEntityBase
    {
        public string Login { get; set; } = null!;
    }
}
