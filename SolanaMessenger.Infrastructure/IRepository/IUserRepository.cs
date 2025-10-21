using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task<User?> GetByLoginAsync(string login);
        Task<List<User>> GetByIDsAsync(List<Guid> usersIDs);
    }
}
