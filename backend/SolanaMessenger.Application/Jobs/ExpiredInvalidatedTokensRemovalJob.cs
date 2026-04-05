using Microsoft.Extensions.Logging;
using Quartz;
using SolanaMessenger.Application.BusinessServicesInterfaces;

namespace SolanaMessenger.Application.Jobs
{
    public class ExpiredInvalidatedTokensRemovalJob : IJob
    {
        private readonly ITokenBS _tokenBS;
        private readonly ILogger _logger;

        public ExpiredInvalidatedTokensRemovalJob(
            ITokenBS tokenBs,
            ILoggerFactory loggerFactory)
        {
            _tokenBS = tokenBs;
            _logger = loggerFactory.CreateLogger<ExpiredInvalidatedTokensRemovalJob>();
        }


        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("{name} is starting", typeof(ExpiredInvalidatedTokensRemovalJob).Name);

            try
            {
                await _tokenBS.RemoveExpiredInvalidatedTokens();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return;
            }

            _logger.LogInformation("{name} has been successfully executed", typeof(ExpiredInvalidatedTokensRemovalJob).Name);
        }
    }
}
