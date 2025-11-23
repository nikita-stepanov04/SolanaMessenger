using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application
{
    public class ChatSettings
    {
        [Required] public int MessagesPerRequest { get; set; }
    }
}
