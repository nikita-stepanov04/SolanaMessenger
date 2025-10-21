using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SolanaMessenger.Application.BusinessServices;
using SolanaMessenger.Application.BusinessServicesInterfaces;

namespace SolanaMessenger.Application
{
    public class DefaultApplicationDIManager : IApplicationDIManager
    {
        public IServiceCollection SetupApplicationDI(IServiceCollection services, IConfiguration config)
        {
            services.AddAutoMapper(cfg => { }, typeof(DefaultApplicationDIManager).Assembly);

            services.AddScoped<IUserBS, UserBS>();
            services.AddScoped<ITokenBS, TokenBS>();
            services.AddScoped<IChatBS, ChatBS>();

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
            return services;
        }
    }
}
