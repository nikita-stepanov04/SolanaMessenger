using SolanaMessenger.Application;

namespace SolanaMessenger.Web
{
    public static class NotificationManager
    {
        public static void SetUpNotifications(this IServiceCollection services)
        {
            services.AddScoped<INewMessageNotification, NewMessageNotification>();
        }
    }
}
