using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SolanaMessenger.Application.BusinessServices;
using SolanaMessenger.Application.BusinessServicesInterfaces;
using SolanaMessenger.Domain;

namespace SolanaMessenger.Application
{
    public class DefaultApplicationDIManager : IDependencyInjectionManager
    {
        public IServiceCollection SetupDI(IServiceCollection services, IConfiguration config)
        {
            services.AddAutoMapper(cfg => { }, typeof(DefaultApplicationDIManager).Assembly);

            services.AddScoped<IUserBS, UserBS>();
            services.AddScoped<ITokenBS, TokenBS>();
            services.AddScoped<IChatBS, ChatBS>();
            services.AddScoped<IMessageBS, MessageBS>();

            services.AddOptions<JwtSettings>()
                .BindConfiguration("Jwt")
                .ValidateDataAnnotations()
                .Validate(
                    validation: s => s.AccessTokenKey != s.RefreshTokenKey,
                    failureMessage: "Access token can not be equal to refresh token"
                ).ValidateOnStart();

            services.AddOptions<AdminSettings>()
                .BindConfiguration("Admins")
                .ValidateDataAnnotations()
                .ValidateOnStart();

            services.AddOptions<RequestSettings>()
                .BindConfiguration("Requests")
                .ValidateDataAnnotations()
                .ValidateOnStart();

            return services;
        }
    }
}
