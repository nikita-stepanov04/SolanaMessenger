namespace SolanaMessenger.Application.DTOs
{
    public class UserPayloadDTO
    {
        public byte[] EphemeralPublicKey { get; set; } = null!;
        public byte[] Nonce { get; set; } = null!;
        public byte[] EncryptedMessageEncryptionKey { get; set; } = null!;
    }
}
