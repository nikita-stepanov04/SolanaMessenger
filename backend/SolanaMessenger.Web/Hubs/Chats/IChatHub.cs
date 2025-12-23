using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Web.Hubs
{
    public interface IChatHub
    {
        Task ConnectToChat(Guid chatID);
        Task DisconnectFromChat(Guid chatID);
        Task ReceiveMessage(MessageDTO message);
        Task UserAddedToChat(ChatMinimalDTO chat);
    }
}
