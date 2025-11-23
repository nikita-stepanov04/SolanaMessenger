namespace SolanaMessenger.Application.DTOs
{ 
    public class MessageDTO : DTOBase
    {
        public Guid ID { get; set; }
        public Guid UserID { get; set; }
        public Guid ChatID { get; set; }
        public long Timestamp { get; set; }
        public string Text { get; set; } = null!;
        public byte[] Salt { get; set; } = null!;
        public byte[] Tag { get; set; } = null!;
    }
}
