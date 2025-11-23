using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFOnMessageModelCreating : EFOnModelCreatingBase<Message>
    {
        protected override void OnModelCreating(EntityTypeBuilder<Message> model)
        {
            model.HasIndex(m => m.Timestamp);
        }
    }
}
