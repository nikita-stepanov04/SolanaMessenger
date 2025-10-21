using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application
{
    public class AdminSettings
    {
        [Required] public string AdminMasterPassword { get; set; } = null!;
    }
}
