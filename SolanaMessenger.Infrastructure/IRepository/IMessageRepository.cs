using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure
{
    public interface IMessageRepository : IRepositoryBase<Message>
    {
        Task<List<Message>> GetMessagesAsync(Guid chatID, int count, long? lastMessageTimestamp = null);
    }
}
