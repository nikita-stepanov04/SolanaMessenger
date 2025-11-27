using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFOnChatModelCreating : EFOnModelCreatingBase<Chat>
    {
        protected override void OnModelCreating(EntityTypeBuilder<Chat> model)
        {
            model.Property(e => e.Name)
                .HasColumnType("varchar(50)");            
        }
    }
}
