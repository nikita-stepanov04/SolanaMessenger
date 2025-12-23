using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface IChatBS
    {
        Task<List<ChatMinimalDTO>> GetAllByUserIDAsync(Guid userID);
        Task<OpRes<ChatDTO>> GetByChatIDForUserAsync(Guid chatId, Guid userID);
        Task<OpRes<ChatMinimalDTO>> CreateChatAsync(ChatCreateDTO chatDTO);
    }
}
