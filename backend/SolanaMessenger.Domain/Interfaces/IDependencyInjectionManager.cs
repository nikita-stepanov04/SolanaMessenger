using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Domain
{
    public interface IDependencyInjectionManager
    {
        IServiceCollection SetupDI(IServiceCollection services, IConfiguration config);
    }
}
