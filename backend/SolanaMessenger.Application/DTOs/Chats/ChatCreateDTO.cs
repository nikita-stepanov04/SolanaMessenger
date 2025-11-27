using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application.DTOs
{
    public class ChatCreateDTO : DTOBase
    {
        [Required(ErrorMessage = "Chat name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Chat name must be between 3 and 50 characters")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Chat users list is required")]
        [MinLength(2, ErrorMessage = "Chat must have at least 2 participants")]
        public List<Guid> ChatUsersIDs { get; set; } = new();
    }

}
