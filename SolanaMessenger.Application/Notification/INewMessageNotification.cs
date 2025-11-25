using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application
{
    public interface INewMessageNotification : INotification<MessageData>
        { }
}
