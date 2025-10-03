using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    internal class EFOnUserModelCreating : EFOnModelCreatingBase<User>
    {
        protected override void OnEntityModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Login)
                    .IsUnique();

                entity.Property(e => e.Login)
                   .HasColumnType("varchar(50)");
            });
        }
    }
}
