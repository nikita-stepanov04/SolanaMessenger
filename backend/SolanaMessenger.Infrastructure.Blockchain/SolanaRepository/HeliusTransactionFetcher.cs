using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Solnet.Wallet.Utilities;
using System.Text;
using System.Text.Json;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class HeliusTransactionFetcher<TObject>
        where TObject : class, new()
    {
        const int REQUEST_TIMEOUT = 30; // seconds
        const int SIGNATURE_LENGTH = 64;
        const int MAX_REQUESTS_RETRIES = 3;
        const string DEV_URL = "https://devnet.helius-rpc.com";
        const string MAIN_URL = "https://mainnet.helius-rpc.com";

        private ILogger _logger;
        private readonly string _endpoint;
        private readonly HttpClient _httpClient;
        private readonly SolanaSettings _solanaSettings;

        public HeliusTransactionFetcher(
            ILoggerFactory loggerFactory,
            IOptions<SolanaSettings> solanaSettings)
        {
            _solanaSettings = solanaSettings.Value;

            _httpClient = new HttpClient()
            {
                Timeout = TimeSpan.FromSeconds(REQUEST_TIMEOUT)
            };

            _logger = loggerFactory.CreateLogger<HeliusTransactionFetcher<TObject>>();

            var baseUrl = _solanaSettings.UseDevelopingSolanaCluster ? DEV_URL : MAIN_URL;
            _endpoint = $"{baseUrl}/?api-key={_solanaSettings.HeliusApiKey}";
        }

        public async Task<TObject?> GetObjectAsync(byte[] signaturesBytes)
        {
            var signatures = RestoreSignature(signaturesBytes);
            var tasks = signatures.Select(s => GetTransactionAsync(s));
            var memoStrings = await Task.WhenAll(tasks);

            var success = memoStrings?.All(s => s != null) ?? false;

            if (!success)
            {
                _logger.LogCritical("Failed to fetch object of type {t} from blockchain", typeof(TObject).Name);
                return null;
            }

            var sb = new StringBuilder();
            foreach (var dw in memoStrings!
                .Select(sW => DataWrapper.Deserialize(sW!))
                .OrderBy(dw => dw.Part))
            {
                sb.Append(dw.Data);
            }

            _logger.LogInformation("Successfully fetched object of type {t} from blockchain", typeof(TObject).Name);
            return JsonSerializer.Deserialize<TObject>(sb.ToString())!;
        }

        private async Task<string?> GetTransactionAsync(string signature)
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
                    var response = await _httpClient.PostAsync(_endpoint, content);

                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.LogWarning("Failed to fetch transaction {t}, status code: {c}", signature, response.StatusCode);
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

        private List<string> RestoreSignature(byte[] signatures)
        {
            var result = new List<string>();
            var count = signatures.Length / 64;

            for (int i = 0; i < count; i++)
            {
                var sigBytes = signatures.AsSpan(i * SIGNATURE_LENGTH, SIGNATURE_LENGTH);
                result.Add(Encoders.Base58.EncodeData(sigBytes.ToArray()));
            }

            return result;
        }
    }
}
