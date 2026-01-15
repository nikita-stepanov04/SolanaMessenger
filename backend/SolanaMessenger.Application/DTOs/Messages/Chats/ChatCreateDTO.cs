using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application.DTOs
{
    public class ChatCreateDTO : DTOBase
    {
        [Required(ErrorMessage = "Chat name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Chat name must be between 3 and 50 characters")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Chat users list is required")]
        [Length(2, 10, ErrorMessage = "Chat must include between 2 and 10 participants")]
        public List<Guid> ChatUsersIDs { get; set; } = new();
    }

}
