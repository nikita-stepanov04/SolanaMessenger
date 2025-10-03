namespace SolanaMessenger.Domain.Entities
{
    public class BlockchainEntityBase : EntityBase
    {
        public byte[] Signatures { get; set; } = null!;
    }
}
