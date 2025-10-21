using NCrypto = NSec.Cryptography;
using System.Security.Cryptography;
using System.Text;

namespace SolanaMessenger.Application.Cryptography
{
    public static class Hashing
    {
        private const int PBKDF2_SALT_SIZE = 16;
        private const int PBKDF2_HASH_LENGTH = 32;
        private const int PBKDF2_ITERATIONS = 100_000;

        public static byte[] Sha256(string str) => Sha256(Encoding.UTF8.GetBytes(str));

        public static byte[] Sha256(params List<byte[]> parts) => Sha256(null, parts);

        public static byte[] Sha256(params List<string> parts) => 
            Sha256(null, parts.Select(Encoding.UTF8.GetBytes).ToList());

        public static byte[] Sha256(string? label, params List<byte[]> parts)
        {
            NCrypto.IncrementalHash.Initialize(NCrypto.HashAlgorithm.Sha256, out var state);
            if (label != null)
            {
                NCrypto.IncrementalHash.Update(ref state, Encoding.UTF8.GetBytes(label));
            }
            parts.ForEach(p => NCrypto.IncrementalHash.Update(ref state, p));
            return NCrypto.IncrementalHash.Finalize(ref state);
        }

        public static PBKDF2Result PBKDF2(string password, byte[]? salt = null)
        {
            salt = salt ?? RandomNumberGenerator.GetBytes(PBKDF2_SALT_SIZE);
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, PBKDF2_ITERATIONS, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(PBKDF2_HASH_LENGTH);

            return new PBKDF2Result
            {
                Hash = hash,
                Salt = salt
            };
        }
    }

    public class PBKDF2Result
    {
        public byte[] Hash { get; set; } = null!;
        public byte[] Salt { get; set; } = null!;
    }
}
