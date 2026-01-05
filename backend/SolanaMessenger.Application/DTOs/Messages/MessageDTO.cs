namespace SolanaMessenger.Application.DTOs
{ 
    public class MessageDTO : DTOBase
    {
        public Guid ID { get; set; }
        public Guid UserID { get; set; }
        public Guid ChatID { get; set; }
        public long Timestamp { get; set; }
        public string Ciphertext { get; set; } = null!;
        public string Nonce { get; set; } = null!;
        public string Tag { get; set; } = null!;
    }
}
