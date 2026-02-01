using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaSettings
    {
        [Required] public string WalletPublicKey { get; set; } = null!;
        [Required] public string WalletPrivateKey { get; set; } = null!;
        [Required] public string HeliusApiKey { get; set; } = null!;
        [Required] public bool UseDevelopingSolanaCluster { get; set; }
    }
}
