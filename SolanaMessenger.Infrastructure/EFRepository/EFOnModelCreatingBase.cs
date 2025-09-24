using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public abstract class EFOnModelCreatingBase<TEntity>
        where TEntity : EntityBase
    {
        public void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TEntity>().HasKey(e => e.ID);
            OnEntityModelCreating(modelBuilder);
        }

        protected abstract void OnEntityModelCreating(ModelBuilder modelBuilder);
    }
}
