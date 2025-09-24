using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application.DTOs
{
    public class UserLoginDTO : DTOBase
    {
        [Required(ErrorMessage = "Login is required.")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Login must be between 6 and 50 characters.")]
        public string Login { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(50, ErrorMessage = "Password must be at most 50 characters.")]
        public string Password { get; set; } = null!;
    }
}
