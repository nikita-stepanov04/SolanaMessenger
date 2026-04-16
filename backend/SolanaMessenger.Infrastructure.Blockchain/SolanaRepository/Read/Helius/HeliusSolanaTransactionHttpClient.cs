using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.RateLimiting;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository.Read.Helius
{
    public class HeliusSolanaTransactionHttpClient : IDisposable
    {
        const int REQUEST_TIMEOUT = 30; // seconds
        const string DEV_URL = "https://devnet.helius-rpc.com";
        const string MAIN_URL = "https://mainnet.helius-rpc.com";

        private readonly string _baseUrl;
        private readonly HttpClient _httpClient;
        private readonly SolanaSettings _settings;
        private readonly IReadOnlyList<ApiKeyInfo> _apiKeyPull;
        private readonly CancellationTokenSource _cancellationTokenSource;
        private readonly ILogger<HeliusSolanaTransactionHttpClient> _logger;      

        public HeliusSolanaTransactionHttpClient(
            IOptions<SolanaSettings> opts,
            ILoggerFactory loggerFactory)
        {
            _settings = opts.Value;
            _logger = loggerFactory.CreateLogger<HeliusSolanaTransactionHttpClient>();
            _cancellationTokenSource = new CancellationTokenSource();

            _baseUrl = _settings.UseDevelopingSolanaCluster
                ? DEV_URL : MAIN_URL;

            _httpClient = new HttpClient()
            {
                Timeout = TimeSpan.FromSeconds(REQUEST_TIMEOUT)
            };

            _apiKeyPull = CreateApiKeyPull().AsReadOnly();
        }

        public async Task<HttpResponseMessage> PostAsync(HttpContent content)
        {
            var apiKeyInfo = _apiKeyPull[Random.Shared.Next(_apiKeyPull.Count)];

            _logger.LogDebug("Using api key {key} for request execution, remaining permits: {p}", 
                apiKeyInfo.Number, apiKeyInfo.LimiterAvailablePermits);

            using var lease = await apiKeyInfo
                .RateLimiter.AcquireAsync(1, _cancellationTokenSource.Token);

            if (!lease.IsAcquired)
                throw new InvalidOperationException("Failed to acquire a lease");

            return await _httpClient.PostAsync(apiKeyInfo.Url, content);
        }

        public void Dispose()
        {
            _httpClient.Dispose();
            _cancellationTokenSource.Cancel();
            foreach (var info in _apiKeyPull)
            {
                info.RateLimiter.Dispose();
            }
        }

        private List<ApiKeyInfo> CreateApiKeyPull()
        {
            var pull = _settings.HeliusApiKeys.Select((key, index) => new ApiKeyInfo
            {
                Number = index + 1,
                Url = $"{_baseUrl}/?api-key={key}",
                RateLimiter = new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions
                {
                    Window = TimeSpan.FromMilliseconds(1200),
                    PermitLimit = _settings.HeliusRequestsPerSecLimit,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = _settings.HeliusRequestsPerSecLimit * 10,
                })
            }).ToList();

            _logger.LogInformation("Helius API key pull was created with {n} keys", pull.Count);

            return pull;
        }

        private class ApiKeyInfo
        {
            public int Number { get; init; }
            public required string Url { get; init; }
            public required RateLimiter RateLimiter { get; init; }
            public long LimiterAvailablePermits => RateLimiter.GetStatistics()?.CurrentAvailablePermits ?? 0;
        }
    }
}
