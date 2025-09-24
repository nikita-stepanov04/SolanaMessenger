using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    internal class EFOnInvalidatedTokenModelCreating : EFOnModelCreatingBase<InvalidatedToken>
    {
        protected override void OnEntityModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<InvalidatedToken>(entity =>
            {
                entity.HasIndex(e => e.TokenID);
                entity.Property(e => e.TokenID)
                    .HasColumnType("varchar(32)");
            });
        }
    }
}
