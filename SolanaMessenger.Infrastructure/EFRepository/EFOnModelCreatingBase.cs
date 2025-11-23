using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public abstract class EFOnModelCreatingBase<TEntity> : IEntityTypeConfiguration<TEntity>
        where TEntity : EntityBase
    {
        public void Configure(EntityTypeBuilder<TEntity> model)
        {
            model.HasKey(e => e.ID);
            model.Property(e => e.ID)
                .ValueGeneratedNever();

            OnModelCreating(model);
        }

        protected abstract void OnModelCreating(EntityTypeBuilder<TEntity> model);
    }
}
