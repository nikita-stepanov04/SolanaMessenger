using SolanaMessenger.Application.DependencyInjection;
using SolanaMessenger.Infrastructure;
using SolanaMessenger.Infrastructure.EFRepository;
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

            services
                .AddControllers()
                .SetUpJsonOptions();

            services.AddEndpointsApiExplorer();
            services.SetUpSwagger();

            IInfrastructureManager infManager = new EFInfrastructureManager();
            infManager.SetupInfrastructure(services, config);

            services.SetupApplicationDependencyInjection();

            services.SetUpCors();
            services.SetUpOptions();
            services.SetUpIdentity(config);

            var app = builder.Build();

            app.UseCors("AllowAll");

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapGet("/", async context => context.Response.Redirect("/swagger/index.html", false));

            app.MapControllers();

            app.Run();
        }
    }
}
