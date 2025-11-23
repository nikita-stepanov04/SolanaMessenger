using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application.DTOs
{
    public class WriteMessageDTO : DTOBase
    {
        [Required]
        public Guid ID { get; set; }

        [Required]
        public Guid UserID { get; set; }

        [Required]
        public Guid ChatID { get; set; }

        [Required]
        public string Text { get; set; } = null!;

        [Required]
        public byte[] Salt { get; set; } = null!;

        [Required]
        public byte[] Tag { get; set; } = null!;

        protected override List<ValidationResult> ValidateAfterBase(ValidationContext context)
        {
            var realTextLength = Text.Trim().Length;
            if (realTextLength == 0)
            {
                return [new ValidationResult("Text could not be shorter than 1 sign", [nameof(Text)])];
            }
            return [];
        }
    }
}
