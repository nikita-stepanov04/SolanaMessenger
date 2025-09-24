using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure
{
    public interface IRepositoryBase<TEntity> where TEntity : EntityBase
    {
        Task<TEntity?> GetByIDAsync(long id);
        Task AddAsync(TEntity entity);
        Task SaveChangesAsync();
    }
}
