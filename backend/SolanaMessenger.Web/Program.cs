using SolanaMessenger.Application;
using SolanaMessenger.Infrastructure;
using SolanaMessenger.Infrastructure.Blockchain;
using SolanaMessenger.Infrastructure.Blockchain.SolanaRepository;
using SolanaMessenger.Infrastructure.EFRepository;
using SolanaMessenger.Web.Configuration;
using SolanaMessenger.Web.Hubs;
using SolanaMessenger.Web.Identity;

namespace SolanaMessenger.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var services = builder.Services;
            var config = builder.Configuration;

            builder.SetupLogger();

            services.AddControllers()
                .SetUpJsonOptions();

            services.AddEndpointsApiExplorer();
            services.SetUpSwagger();

            IInfrastructureDIManager infManager = new EFInfrastructureDIManager();
            infManager.SetupInfrastructureDI(services, config);

            IBlockchainInfrastructureDIManager blkManager = new SolanaBlockchainDIManager();
            blkManager.SetupBlockchainInfrastructureDI(services, config);

            IApplicationDIManager appManager = new DefaultApplicationDIManager();
            appManager.SetupApplicationDI(services, config);

            services.SetUpHubs();

            services.SetUpCors();
            services.SetUpIdentity(config);

            var app = builder.Build();

            app.UseCors("AllowAll");

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapGet("/", async context => context.Response.Redirect("/swagger/index.html", false));
            app.MapControllers();
            app.MapHubs();

            app.Run();
        }
    }
}
