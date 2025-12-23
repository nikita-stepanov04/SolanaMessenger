namespace SolanaMessenger.Application
{
    public interface INotificator<T> 
        where T : class
    {
        void Notify(T obj);
    }
}
