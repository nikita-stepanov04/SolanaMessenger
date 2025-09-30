using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Infrastructure.Blockchain
{
    public interface IBlockchainInfrastructureManager
    {
        IServiceCollection SetupBlockchainInfrastructure(IServiceCollection services, IConfiguration config);
    }
}
