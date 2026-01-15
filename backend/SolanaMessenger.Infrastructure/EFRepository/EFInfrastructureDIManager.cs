using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SolanaMessenger.Domain;
using System;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFInfrastructureDIManager : IDependencyInjectionManager
    {
        public IServiceCollection SetupDI(IServiceCollection services, IConfiguration config)
        {
            string? dbConnection = config.GetConnectionString("DbConnection");

            if (dbConnection == null) throw new ArgumentNullException("DbConnection is not defined");

            services.AddDbContext<EFDataContext>(opts =>
            {
                opts.UseLazyLoadingProxies();
                opts.UseNpgsql(dbConnection, dbOpts =>
                    dbOpts.MigrationsAssembly("SolanaMessenger.Infrastructure"));

                #if DEBUG
                    opts.EnableSensitiveDataLogging();
                #endif
            });

            services.SetupEFDependencyInjection();

            return services;
        }
    }
}
