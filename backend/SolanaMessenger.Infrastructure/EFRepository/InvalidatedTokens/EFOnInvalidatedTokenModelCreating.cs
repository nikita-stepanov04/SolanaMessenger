using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    internal class EFOnInvalidatedTokenModelCreating : EFOnModelCreatingBase<InvalidatedToken>
    {
        protected override void OnModelCreating(EntityTypeBuilder<InvalidatedToken> model)
        {
            model.HasIndex(e => e.TokenID);
            model.Property(e => e.TokenID)
                .HasColumnType("varchar(32)");
        }
    }
}
