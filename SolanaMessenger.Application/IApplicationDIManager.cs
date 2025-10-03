using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Application
{
    public interface IApplicationDIManager
    {
        IServiceCollection SetupApplicationDI(IServiceCollection services, IConfiguration config);
    }
}
