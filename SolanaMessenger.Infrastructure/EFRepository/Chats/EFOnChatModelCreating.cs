using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository.Chats
{
    public class EFOnChatModelCreating : EFOnModelCreatingBase<Chat>
    {
        protected override void OnEntityModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Chat>(entity =>
            {
                entity.Property(e => e.Name)
                   .HasColumnType("varchar(50)");
            });
        }
    }
}
