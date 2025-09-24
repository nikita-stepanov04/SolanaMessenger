using System.Text;

namespace SolanaMessenger.Application.Cryptography
{
    public static class Hashing
    {
        public static byte[] Sha256(string str)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var strBytes = Encoding.UTF8.GetBytes(str);
            return sha.ComputeHash(strBytes);
        } 
    }
}
