using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository.Read.Helius
{
    public class HeliusSolanaTransactionReader<TObject>
        : SolanaTransactionReader<TObject>
        where TObject : class, new()
    {
        const int REQUEST_RETRY_AFTER = 3; // seconds
        const int MAX_REQUESTS_RETRIES = 3;

        private readonly HeliusSolanaTransactionHttpClient _httpClient;

        public HeliusSolanaTransactionReader(
            ILoggerFactory loggerFactory,
            IOptions<SolanaSettings> solanaSettings,
            HeliusSolanaTransactionHttpClient httpClient)
            : base(loggerFactory, solanaSettings)
        {
            _httpClient = httpClient;
        }

        protected override async Task<string?> GetTransactionAsync(string signature)
        {
            var payload = new
            {
                id = 1,
                jsonrpc = "2.0",
                method = "getTransaction",
                @params = new object[]
                {
                    signature,
                    new { encoding = "json", commitment = "confirmed" }
                }
            };

            var serializedPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(serializedPayload, Encoding.UTF8, "application/json");

            int retriesCount = 0;
            while (retriesCount < MAX_REQUESTS_RETRIES)
            {
                retriesCount++;

                try
                {
                    _logger.LogDebug("Fetching transaction {s}, try: {r}/{m}",
                        signature, retriesCount, MAX_REQUESTS_RETRIES);

                    var response = await _httpClient.PostAsync(content);

                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.LogWarning("Failed to fetch transaction {s}, status code: {c}, retry after {t} seconds",
                            signature, response.StatusCode, REQUEST_RETRY_AFTER);
                        await Task.Delay(TimeSpan.FromSeconds(REQUEST_RETRY_AFTER));
                        continue;
                    }

                    var resString = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<HeliusResponse>(resString)!;

                    return data.GetMemoData();
                }
                catch (Exception ex)
                {
                    _logger.LogCritical("Failed to fetch {transaction} because of exception of type: {exType}",
                        signature, ex.GetType().Name);
                }
            }

            _logger.LogCritical("Failed to fetch {transaction}", signature);
            return null;
        }
    }
}
