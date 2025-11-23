using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface IMessageBS
    {
        Task<OpRes<Guid>> WriteMessage(WriteMessageDTO dto);
        Task<List<MessageDTO>> GetMessagesForChat(Guid chatID, long? lastMessageTimestamp = null);
    }
}
