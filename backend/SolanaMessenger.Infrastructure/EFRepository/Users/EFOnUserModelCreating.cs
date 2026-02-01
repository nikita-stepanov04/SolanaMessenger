using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    internal class EFOnUserModelCreating : EFOnModelCreatingBase<User>
    {
        protected override void OnModelCreating(EntityTypeBuilder<User> model)
        {
            model.HasIndex(e => e.Login)
                .IsUnique();

            model.Property(e => e.Login)
                .HasColumnType("varchar(50)");
        }
    }
}
