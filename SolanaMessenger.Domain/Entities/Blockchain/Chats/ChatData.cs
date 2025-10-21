namespace SolanaMessenger.Domain.Entities
{
    public class ChatData : EntityBase
    {
        public string Name { get; set; } = null!;
        public long TimeStamp { get; set; }
        public Dictionary<Guid, UserPayload> UserPayload { get; set; } = null!;
    }
}
