using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application
{
    public class RequestSettings
    {
        [Required] public int MessagesPerRequest { get; set; }
        [Required] public int UsersPerSearch { get; set; }
    }
}
