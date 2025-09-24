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

                entity.Property(e => e.FirstName)
                    .HasColumnType("varchar(50)");

                entity.Property(e => e.SecondName)
                    .HasColumnType("varchar(50)");

                entity.Property(e => e.LastName)
                    .HasColumnType("varchar(50)");

                entity.Property(e => e.Role)
                    .HasConversion<short>()
                    .HasColumnType("smallint");
            });
        }
    }
}
