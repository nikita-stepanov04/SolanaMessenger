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

        public static IServiceCollection SetUpCors(this IServiceCollection services)
        {
            services.AddCors(opts =>
            {
                opts.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                    builder.AllowAnyOrigin();
                });
            });
            return services;
        }
    }
}
