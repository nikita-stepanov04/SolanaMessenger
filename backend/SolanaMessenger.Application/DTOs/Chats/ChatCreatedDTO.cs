namespace SolanaMessenger.Application.DTOs
{
    public class ChatCreatedDTO
    {
        public Guid ID { get; set; }
        public string Name { get; set; } = null!;
        public List<Guid> UserIDs { get; set; } = null!;
    }
}
