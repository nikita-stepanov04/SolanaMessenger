namespace SolanaMessenger.Application
{
    public interface INotificator<T> 
        where T : class
    {
        Task NotifyAsync(T obj);
    }
}
