using SolanaMessenger.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application.DTOs
{
    public class UserRegistrationDTO : DTOBase
    {
        [Required(ErrorMessage = "Login is required.")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Login must be between 6 and 50 characters.")]
        public string Login { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Password must be at most 50 characters.")]
        public string Password { get; set; } = null!;

        [StringLength(50, ErrorMessage = "Password must be at most 50 characters.")]
        public string? MasterPassword { get; set; }

        [Required(ErrorMessage = "Public encryption key is required.")]
        [Base64String(ErrorMessage = "Public encryption key must be a valid base64 string.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Public encryption key must be at least 1 character.")]
        public string X25519Pub { get; set; } = null!;

        [Required(ErrorMessage = "First name is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "First name must be between 3 and 50 characters.")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Second name is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Second name must be between 3 and 50 characters.")]
        public string SecondName { get; set; } = null!;

        [StringLength(50, ErrorMessage = "Last name must be at most 50 characters.")]
        public string LastName { get; set; } = null!;

        public Role Role { get; set; } = Role.User;
    }
}
