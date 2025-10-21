namespace SolanaMessenger.Application.DTOs
{
    public class ChatDTO : DTOBase
    {
        public Guid ID { get; set; }
        public string Name { get; set; } = null!;
        public long Timestamp { get; set; }
        public UserPayloadDTO EncryptionPayload { get; set; } = null!;
        public List<ChatUsersDataDTO> UsersData { get; set; } = null!;
    }
}
