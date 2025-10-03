using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFInfrastructureDIManager : IInfrastructureDIManager
    {
        public IServiceCollection SetupInfrastructureDI(IServiceCollection services, IConfiguration config)
        {
            string? dbConnection = config
                .GetConnectionString("DbConnection");

            if (dbConnection == null) throw new ArgumentNullException("DbConnection is not defined");

            services.AddDbContext<EFDataContext>(opts =>
            {
                opts.UseNpgsql(dbConnection, dbOpts =>
                    dbOpts.MigrationsAssembly("SolanaMessenger.Infrastructure"));
            });

            services.SetupEFDependencyInjection();

            return services;
        }
    }
}
