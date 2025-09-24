using System.ComponentModel.DataAnnotations;

namespace SolanaMessenger.Application.DTOs
{
    public abstract class DTOBase
    {
        public List<ValidationResult> Validate()
        {
            var context = new ValidationContext(this);
            return ValidateAfterBase(context);
        }

        protected virtual List<ValidationResult> ValidateAfterBase(ValidationContext context) => [];
    }
}
