namespace SolanaMessenger.Domain.Entities
{
    public class UserPayload
    {
        public byte[] EphemeralPublicKey { get; set; } = null!;
        public byte[] Nonce { get; set; } = null!;
        public byte[] EncryptedMessageEncryptionKey { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string SecondName { get; set; } = null!;
        public string LastName { get; set; } = null!;
    }
}
