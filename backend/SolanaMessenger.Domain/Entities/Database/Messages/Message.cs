namespace SolanaMessenger.Domain.Entities
{
    public class Message : BlockchainEntityBase
    {
        public Guid ChatID { get; set; }
        public long Timestamp { get; set; }

        public virtual Chat? Chat { get; set; }
    }
}
