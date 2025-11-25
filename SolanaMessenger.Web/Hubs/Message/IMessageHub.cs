using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Web.Hubs
{
    public interface IMessageHub
    {
        Task SendMessageAsync(MessageDTO message);
    }
}
