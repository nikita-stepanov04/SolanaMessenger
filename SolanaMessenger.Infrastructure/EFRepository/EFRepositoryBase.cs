using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFRepositoryBase<TEntity> : IRepositoryBase<TEntity>
        where TEntity : EntityBase
    {
        protected EFDataContext DbContext { get; }

        public EFRepositoryBase(EFDataContext context) 
        {
            DbContext = context;
        }

        public async Task AddAsync(TEntity entity)
        {
            await DbContext.Set<TEntity>().AddAsync(entity);
        }       

        public async Task<TEntity?> GetByIDAsync(long id)
        {
            return await DbContext.Set<TEntity>().FindAsync(id);
        }

        public async Task SaveChangesAsync()
        {
            await DbContext.SaveChangesAsync();
        }
    }
}
