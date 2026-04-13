using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Solnet.Wallet.Utilities;
using System.Text;
using System.Text.Json;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public abstract class SolanaTransactionReader<TObject>
        where TObject : class, new()
    {
        const int SIGNATURE_LENGTH = 64;

        protected readonly ILogger _logger;
        protected readonly SolanaSettings _solanaSettings;

        public SolanaTransactionReader(
            ILoggerFactory loggerFactory,
            IOptions<SolanaSettings> solanaSettings)
        {
            _solanaSettings = solanaSettings.Value;
            _logger = loggerFactory.CreateLogger<SolanaTransactionReader<TObject>>();
        }

        protected abstract Task<string?> GetTransactionAsync(string signature);

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
