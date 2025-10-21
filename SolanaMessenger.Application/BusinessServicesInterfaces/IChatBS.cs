using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface IChatBS
    {
        Task<List<ChatMinimalDTO>> GetAllByUserIDAsync(Guid userID);
        Task<OperationResult<ChatDTO>> GetByChatIDForUserAsync(Guid chatId, Guid userID);
        Task<OperationResult<Guid>> CreateChatAsync(ChatCreateDTO chatDTO);
    }
}
