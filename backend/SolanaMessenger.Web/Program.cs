using SolanaMessenger.Application;
using SolanaMessenger.Domain;
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

            new List<IDependencyInjectionManager>
            {
                new EFInfrastructureDIManager(),
                new SolanaBlockchainDIManager(),
                new DefaultApplicationDIManager()
            }.ForEach(di => di.SetupDI(services, config));

            services.SetUpCors(config);
            services.SetUpHubs();
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

            app.Services.ApplyMigrations();
            app.Run();
        }
    }
}
