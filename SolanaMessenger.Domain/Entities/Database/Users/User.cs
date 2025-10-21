namespace SolanaMessenger.Domain.Entities
{
    public class User : BlockchainEntityBase
    {
        public string Login { get; set; } = null!;
        public virtual List<Chat> Chats { get; set; } = new();
    }
}
