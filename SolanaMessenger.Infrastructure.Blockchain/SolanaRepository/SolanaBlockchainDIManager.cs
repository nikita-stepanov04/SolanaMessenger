using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaBlockchainDIManager : IBlockchainInfrastructureDIManager
    {
        public IServiceCollection SetupBlockchainInfrastructureDI(IServiceCollection services, IConfiguration config)
        {
            services.AddScoped(typeof(IBlockchainRepository<>), typeof(SolanaRepository<>));
            services.AddScoped(typeof(SolanaTransactionManager<>));
            services.AddScoped(typeof(HeliusTransactionFetcher<>));
            services.AddSingleton(typeof(SolanaTransactionSocketListener));

            services.AddOptions<SolanaSettings>()
                 .BindConfiguration("Solana")
                 .ValidateDataAnnotations()
                 .ValidateOnStart();

            return services;
        }
    }
}
