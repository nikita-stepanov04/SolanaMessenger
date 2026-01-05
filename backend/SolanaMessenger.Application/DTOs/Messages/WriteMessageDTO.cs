using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application.DTOs
{
    public class WriteMessageDTO : DTOBase
    {
        [Required]
        public Guid ChatID { get; set; }

        [Required]
        public string Ciphertext { get; set; } = null!;

        [Required]
        [Base64String]
        public string Nonce { get; set; } = null!;

        [Required]
        [Base64String]
        public string Tag { get; set; } = null!;

        protected override List<ValidationResult> ValidateAfterBase(ValidationContext context)
        {
            var realTextLength = Ciphertext.Trim().Length;
            if (realTextLength == 0)
            {
                return [new ValidationResult("Text could not be shorter than 1 sign", [nameof(Ciphertext)])];
            }
            return [];
        }
    }
}
