using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task<User?> GetByLoginAsync(string login);
    }
}
