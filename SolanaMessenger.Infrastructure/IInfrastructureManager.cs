using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Infrastructure
{
    public interface IInfrastructureManager
    {
        IServiceCollection SetupInfrastructure(IServiceCollection services, IConfiguration config);
    }
}
