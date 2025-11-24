using Microsoft.OpenApi;

namespace SolanaMessenger.Web
{
    public static class SwaggerConfig
    {
        public static IServiceCollection SetUpSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SolanaMessenger", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Insert jwt token: Bearer {your token}",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(doc => new OpenApiSecurityRequirement()
                {
                    [new OpenApiSecuritySchemeReference("Bearer", doc)] = []
                });
            });
            return services;
        }
    }
}
