using NSec.Cryptography;
using System.Security.Cryptography;

namespace SolanaMessenger.Application.Cryptography
{
    public class Encryption
    {
        private readonly Aes256Gcm _encryptAlgorithm = AeadAlgorithm.Aes256Gcm;
        private readonly KeyAgreementAlgorithm _keyAgreementAlgorithm = KeyAgreementAlgorithm.X25519;
        private readonly KeyDerivationAlgorithm _keyDerivationAlgorithm = KeyDerivationAlgorithm.HkdfSha256;

        public byte[] RandomAES256Key => RandomNumberGenerator.GetBytes(32);

        public ECDHWrapResult WrapAESKeyWithECDH(byte[] aes256Key, byte[] recipientX25519Pub, byte[] salt, byte[] aad)
        {
            var keyParams = new KeyCreationParameters { ExportPolicy = KeyExportPolicies.AllowPlaintextExport };

            using var ephemeralPrivateKey = Key.Create(_keyAgreementAlgorithm, keyParams);
            var ephemeralPublicKey = ephemeralPrivateKey.Export(KeyBlobFormat.RawPublicKey);

            var recipientPublicKey = PublicKey.Import(_keyAgreementAlgorithm, recipientX25519Pub, KeyBlobFormat.RawPublicKey);

            using var sharedKey = _keyAgreementAlgorithm.Agree(ephemeralPrivateKey, recipientPublicKey)!;

            var hkdfKey = _keyDerivationAlgorithm.DeriveBytes(sharedKey, salt, null, _encryptAlgorithm.KeySize);

            var importedHkdfKey = Key.Import(_encryptAlgorithm, hkdfKey, KeyBlobFormat.RawSymmetricKey);

            var nonce = RandomNumberGenerator.GetBytes(12);

            var cipherText = _encryptAlgorithm.Encrypt(importedHkdfKey, nonce, aad, aes256Key);

            return new ECDHWrapResult
            {
                EphemeralPublicKey = ephemeralPublicKey,
                Nonce = nonce,
                WrapedKey = cipherText
            };
        }
    }

    public class ECDHWrapResult
    {
        public byte[] EphemeralPublicKey { get; set; } = null!;
        public byte[] Nonce { get; set; } = null!;
        public byte[] WrapedKey { get; set; } = null!;
    }
}
