using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Infrastructure
{
    public interface IInfrastructureDIManager
    {
        IServiceCollection SetupInfrastructureDI(IServiceCollection services, IConfiguration config);
    }
}
