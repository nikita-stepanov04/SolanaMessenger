using Microsoft.AspNetCore.SignalR;

namespace SolanaMessenger.Web.Hubs
{
    public static class HubManager
    {
        public static void SetUpHubs(this IServiceCollection services)
        {
            services.AddSignalR();
            services.SetUpNotifications();

            services.AddSingleton<IUserIdProvider, HubUserIDProvider>();
        }

        public static void MapHubs(this WebApplication app)
        {
            app.MapGroup("/ws")
                .MapHub<ChatHub>("/chats");
        }
    }
}
