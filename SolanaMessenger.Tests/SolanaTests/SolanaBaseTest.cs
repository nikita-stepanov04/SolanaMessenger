using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SolanaMessenger.Infrastructure.Blockchain;
using SolanaMessenger.Infrastructure.Blockchain.SolanaRepository;
using System.Text;

namespace SolanaMessenger.Tests.SolanaTests
{
    public class SolanaBaseTest
    {
        public static Random Rand = new Random(42);
        public static string GetRandomString(int length = 8)
        {
            var builder = new StringBuilder(length);

            for (int i = 0; i < length; i++)
            {
                // 0x61 - 0x7A - Standard ASCII small letters
                var c = (char)Rand.Next(0x61, 0x7A);
                builder.Append(c);
            }

            return builder.ToString();
        }
    }

    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("SolanaTests\\config.json", optional: false, reloadOnChange: false)
                .Build();

            services.AddSingleton<IConfiguration>(config);

            IBlockchainInfrastructureDIManager blockchainInfrastructureManager = new SolanaBlockchainDIManager();
            blockchainInfrastructureManager.SetupBlockchainInfrastructureDI(services, config);
        }
    }
}
