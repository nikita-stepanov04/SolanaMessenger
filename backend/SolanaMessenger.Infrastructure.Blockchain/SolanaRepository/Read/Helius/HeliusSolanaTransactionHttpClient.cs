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
        private readonly IEnumerable<EndpointInfo> _apiKeyPull;
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
            var leastOccupiedEndpointInfo = _apiKeyPull.MinBy(info => info.LimiterQueueCount)!;

            _logger.LogDebug("Using api key {key} for request execution", leastOccupiedEndpointInfo.Number);

            using var lease = await leastOccupiedEndpointInfo
                .RateLimiter.AcquireAsync(1, _cancellationTokenSource.Token);

            if (!lease.IsAcquired)
                throw new InvalidOperationException("Failed to acquire a lease");

            return await _httpClient.PostAsync(leastOccupiedEndpointInfo.Endpoint, content);
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

        private List<EndpointInfo> CreateApiKeyPull()
        {
            var pull = _settings.HeliusApiKeys.Select((key, index) => new EndpointInfo
            {
                Number = index + 1,
                Endpoint = $"{_baseUrl}/?api-key={key}",
                RateLimiter = new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions
                {
                    Window = TimeSpan.FromSeconds(1),
                    PermitLimit = _settings.HeliusRequestsPerSecLimit,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = _settings.HeliusRequestsPerSecLimit * 10,
                })
            }).ToList();

            _logger.LogInformation("Helius API key pull was created with {n} keys", pull.Count);

            return pull;
        }

        private class EndpointInfo
        {
            public int Number { get; init; }
            public required string Endpoint { get; init; }
            public required RateLimiter RateLimiter { get; init; }

            public long LimiterQueueCount => RateLimiter.GetStatistics()?.CurrentQueuedCount ?? 0;
        }
    }
}
