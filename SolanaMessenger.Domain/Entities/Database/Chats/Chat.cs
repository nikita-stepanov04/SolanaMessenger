namespace SolanaMessenger.Domain.Entities
{
    public class Chat : BlockchainEntityBase
    {
        public string Name { get; set; } = null!;
        public virtual List<User> Users { get; set; } = new();
    }
}
