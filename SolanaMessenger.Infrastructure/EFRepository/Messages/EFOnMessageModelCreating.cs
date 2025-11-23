using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFOnMessageModelCreating : EFOnModelCreatingBase<Message>
    {
        protected override void OnEntityModelCreating(ModelBuilder modelBuilder) 
        {
            modelBuilder.Entity<Message>(e =>
            {
                e.HasIndex(m => m.Timestamp);
            });
        }
    }
}
