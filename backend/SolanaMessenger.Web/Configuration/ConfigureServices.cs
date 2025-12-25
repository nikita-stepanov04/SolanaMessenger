using SolanaMessenger.Application.Cryptography;
using System.Text.Json.Serialization;

namespace SolanaMessenger.Web
{
    public static class ConfigureServices
    {
        public static IMvcBuilder SetUpJsonOptions(this IMvcBuilder builder)
        {
            builder.AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            return builder;
        }

        public static IServiceCollection SetUpCors(this IServiceCollection services, IConfiguration config)
        {
            var allowedHosts = config
                .GetSection("Cors:AllowedOrigins")
                .Get<string[]>();

            if (allowedHosts == null)
                throw new Exception("Cors origins are not defined");
            
            services.AddCors(opts =>
            {
                opts.AddPolicy("AllowAll", builder =>
                {
                    builder.WithOrigins(allowedHosts);
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                    builder.AllowCredentials();
                });
            });
            return services;
        }
    }
}
