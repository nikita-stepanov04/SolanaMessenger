using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure
{
    public interface IRepositoryBase<TEntity> where TEntity : EntityBase
    {
        Task<TEntity?> GetByIDAsync(Guid id);
        Task AddAsync(TEntity entity);
        Task SaveChangesAsync();
    }
}
