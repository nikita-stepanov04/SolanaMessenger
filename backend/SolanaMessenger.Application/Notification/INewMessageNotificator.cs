using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface INewMessageNotificator : INotificator<MessageDTO>
    { }
}
