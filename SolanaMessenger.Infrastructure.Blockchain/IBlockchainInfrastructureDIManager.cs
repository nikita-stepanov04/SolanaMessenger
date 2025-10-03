using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Infrastructure.Blockchain
{
    public interface IBlockchainInfrastructureDIManager
    {
        IServiceCollection SetupBlockchainInfrastructureDI(IServiceCollection services, IConfiguration config);
    }
}
