﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Caching.Memory;
using SolanaMessenger.Application.BusinessServicesInterfaces;
using SolanaMessenger.Application.Cryptography;
using System.IdentityModel.Tokens.Jwt;

namespace SolanaMessenger.Web.Identity
{
    public static class IdentityManager
    {
        public static IServiceCollection SetUpIdentity(
            this IServiceCollection services, IConfiguration config)
        {
            JwtSettings jwtSettings = config.GetSection("Jwt").Get<JwtSettings>()!;

            services.AddAuthentication(opts =>
            {
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(opts =>
            {
                opts.UseSecurityTokenValidators = true;
                opts.TokenValidationParameters = Jwt.GetTokenValidationParameters(jwtSettings.AccessTokenKey);
                opts.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var tokenBS = context.HttpContext.RequestServices
                            .GetRequiredService<ITokenBS>();

                        var jwtToken = context.SecurityToken as JwtSecurityToken;

                        if (await tokenBS.IsTokenRevokedAsync(jwtToken!))
                        {
                            context.Fail("Token has been revoked");
                        }
                    }
                };
            });

            services.AddAuthorization(opts =>
            {
                opts.AddPolicy(nameof(Policies.AdminsOnly), p => p.RequireRole(nameof(Roles.Admin)));
                opts.AddPolicy(nameof(Policies.UsersOnly), p => p.RequireRole(nameof(Roles.User)));
            });

            return services;
        }
    }
}
