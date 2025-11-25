namespace SolanaMessenger.Application
{
    public interface INotification<T> 
        where T : class
    {
        void Notify(T obj);
    }
}
