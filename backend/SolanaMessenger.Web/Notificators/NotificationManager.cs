using SolanaMessenger.Application;
using SolanaMessenger.Application.Notification;

namespace SolanaMessenger.Web
{
    public static class NotificationManager
    {
        public static void SetUpNotifications(this IServiceCollection services)
        {
            services.AddScoped<INewChatNotificator, NewChatNotificator>();
            services.AddScoped<INewMessageNotificator, NewMessageNotificator>();
        }
    }
}
