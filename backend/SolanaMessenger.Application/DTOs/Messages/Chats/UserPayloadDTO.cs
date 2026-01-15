namespace SolanaMessenger.Application.DTOs
{
    public class UserPayloadDTO
    {
        public string EphemeralPublicKey { get; set; } = null!;
        public string Nonce { get; set; } = null!;
        public string EncryptedMessageEncryptionKey { get; set; } = null!;
    }
}
