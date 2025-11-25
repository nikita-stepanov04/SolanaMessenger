using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface IMessageBS
    {
        Task<OpRes<Guid>> WriteMessageAsync(WriteMessageDTO dto, Guid userID);
        Task<OpRes<List<MessageDTO>>> LoadChatMessagesAsync(Guid chatID, Guid userID, long lastMessageTimestamp = 0);
    }
}
