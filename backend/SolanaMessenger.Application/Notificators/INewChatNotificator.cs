using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application.Notification
{
    public interface INewChatNotificator : INotificator<ChatCreatedDTO>
    {}
}
