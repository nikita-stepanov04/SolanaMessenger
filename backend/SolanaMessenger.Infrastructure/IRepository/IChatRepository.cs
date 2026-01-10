using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure
{
    public interface IChatRepository : IRepositoryBase<Chat>
    {
        Task<List<Guid>> GetChatUserIDsAsync(Guid chatID);
        Task<List<Chat>> GetAllByUserIDAsync(Guid userID);
        Task<bool> IsUserAChatMemberAsync(Guid chatID, Guid userID);
    }
}
