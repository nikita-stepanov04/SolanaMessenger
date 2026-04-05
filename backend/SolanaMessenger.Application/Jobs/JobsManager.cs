using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace SolanaMessenger.Application.Jobs
{
    public static class JobsManager
    {
        public static IServiceCollection SetUpJobs(this IServiceCollection services)
        {
            services.AddQuartz(q =>
            {
                var tokenRemovalJobKey = new JobKey("ExpiredInvalidatedTokensRemovalJob");
                var tokenRemovalJobTriggerKey = new TriggerKey("ExpiredInvalidatedTokensRemovalJob-Trigger");

                q.AddJob<ExpiredInvalidatedTokensRemovalJob>(opts => opts
                    .WithIdentity(tokenRemovalJobKey)
                    .StoreDurably());

                q.AddTrigger(opts => opts
                    .ForJob(tokenRemovalJobKey)
                    .WithIdentity(tokenRemovalJobTriggerKey)
                    .WithSimpleSchedule(x => x
                        .WithIntervalInHours(24)
                        .RepeatForever()));
            });

            services.AddQuartzHostedService(opts => 
            {
                opts.WaitForJobsToComplete = true;
            });

            return services;
        }
    }
}
