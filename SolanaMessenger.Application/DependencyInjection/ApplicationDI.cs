using Microsoft.Extensions.DependencyInjection;
using SolanaMessenger.Application.BusinessServices;
using SolanaMessenger.Application.BusinessServicesInterfaces;
using SolanaMessenger.Application.Cryptography;

namespace SolanaMessenger.Application.DependencyInjection
{
    public static class ApplicationDI
    {
        public static IServiceCollection SetupApplicationDependencyInjection(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => { }, typeof(ApplicationDI).Assembly);

            services.AddScoped<IUserBS, UserBS>();
            services.AddScoped<ITokenBS, TokenBS>();

            services.AddOptions<JwtSettings>()
                .BindConfiguration("Jwt")
                .ValidateDataAnnotations()
                .Validate(
                    validation: s => s.AccessTokenKey != s.RefreshTokenKey,
                    failureMessage: "Access token can not be equal to refresh token"
                ).ValidateOnStart();
            return services;
        }
    }
}
