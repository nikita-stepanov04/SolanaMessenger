using Serilog;
using Serilog.Core;
using Serilog.Events;

namespace SolanaMessenger.Web.Configuration
{
    public static class ConfigureLogger 
    {
        public static void SetupLogger(this WebApplicationBuilder builder)
        {
            var logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Information)
                .MinimumLevel.Override("LuckyPennySoftware.AutoMapper.License", LogEventLevel.Fatal)
                .Enrich.FromLogContext()
                .Enrich.With<ShortSourceContextEnricher>()
                .WriteTo.Console(
                    outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {ClassName}: {Message:lj}{NewLine}{Exception}"
                )
                .WriteTo.File(
                    path: Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                        "SolanaMessenger", "logs"
                    ),
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 7,
                    outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}"
                )
                .CreateLogger();

            Log.Logger = logger;
            builder.Host.UseSerilog(logger, dispose: true);       
        }
    }

    public class ShortSourceContextEnricher : ILogEventEnricher
    {
        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            if (logEvent.Properties.TryGetValue("SourceContext", out var value))
            {
                var fullName = value.ToString().Trim('"');
                var shortName = fullName.Split('.').Last();
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("ClassName", shortName));
            }
        }
    }
}
