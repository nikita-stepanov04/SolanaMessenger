using Microsoft.Extensions.DependencyInjection;
using SolanaMessenger.Application.BusinessServices;
using SolanaMessenger.Application.BusinessServicesInterfaces;
using SolanaMessenger.Application.DTOs.Users;

namespace SolanaMessenger.Application.DependencyInjection
{
    public static class ApplicationDI
    {
        public static IServiceCollection SetupApplicationDependencyInjection(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => { }, typeof(ApplicationDI).Assembly);

            services.AddScoped<IUserBS, UserBS>();
            services.AddScoped<ITokenBS, TokenBS>();
            return services;
        }
    }
}
