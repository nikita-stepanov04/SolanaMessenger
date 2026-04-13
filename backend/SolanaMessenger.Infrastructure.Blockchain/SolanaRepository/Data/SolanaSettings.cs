using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaSettings
    {
        [Required] public string WalletPublicKey { get; set; } = null!;
        [Required] public string WalletPrivateKey { get; set; } = null!;
        [Required] public int HeliusRequestsPerSecLimit { get; set; }
        [Required] public bool UseDevelopingSolanaCluster { get; set; }

        [Required]
        [MinLength(1)]
        public string[] HeliusApiKeys { get; set; } = null!;
    }
}
