using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface IMessageBS
    {
        Task<OpRes<MessageDTO>> WriteMessage(WriteMessageDTO dto, Guid userID);
        Task<List<MessageDTO>> LoadChatMessages(Guid chatID, long? lastMessageTimestamp = null);
    }
}
