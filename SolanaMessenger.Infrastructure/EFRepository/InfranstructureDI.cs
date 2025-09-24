﻿using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public static class EFDependencyInjection
    {
        public static IServiceCollection SetupEFDependencyInjection(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, EFUserRepository>();
            services.AddScoped<IInvalidatedTokenRepository, EFInvalidatedTokenRepository>();
            return services;
        }
    }
}
