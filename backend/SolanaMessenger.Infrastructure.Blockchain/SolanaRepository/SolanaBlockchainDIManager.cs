using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SolanaMessenger.Domain;
using SolanaMessenger.Infrastructure.Blockchain.SolanaRepository.Read.Helius;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaBlockchainDIManager : IDependencyInjectionManager
    {
        public IServiceCollection SetupDI(IServiceCollection services, IConfiguration config)
        {
            services.AddScoped(typeof(IBlockchainRepository<>), typeof(SolanaRepository<>));

            services.AddScoped(typeof(SolanaTransactionWriter<>));
            services.AddScoped(typeof(HeliusSolanaTransactionReader<>));

            services.AddSingleton(typeof(SolanaTransactionSocketListener));
            services.AddSingleton(typeof(HeliusSolanaTransactionHttpClient));

            services.AddOptions<SolanaSettings>()
                 .BindConfiguration("Solana")
                 .ValidateDataAnnotations()
                 .Validate(settings => 
                    settings.HeliusApiKeys.ToHashSet().Count == settings.HeliusApiKeys.Count(),
                    failureMessage: "Helius API keys array has duplicates"
                 ).ValidateOnStart();

            return services;
        }
    }
}
