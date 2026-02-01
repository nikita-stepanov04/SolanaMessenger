using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Solnet.Programs;
using Solnet.Rpc;
using Solnet.Rpc.Builders;
using Solnet.Wallet;
using Solnet.Wallet.Utilities;
using System.Text.Json;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaTransactionManager<TObject>
        where TObject : class, new()
    {
        private const int MAX_REQUESTS_RETRIES = 3;
        private const int MAX_TRANSACTION_COUNT = 10;
        private const int MAX_TRANSACTION_LENGTH = 1000;
        private const int TRANSACTION_COMPUTING_UNITS = 400_000;

        private readonly Account _account;
        private readonly ILogger _logger;
        private readonly IRpcClient _rpcClient;
        private readonly SolanaSettings _solSettings;
        private readonly SolanaTransactionSocketListener _solListener;

        public SolanaTransactionManager(
            ILoggerFactory loggerFactory,
            IOptions<SolanaSettings> solSettings,
            SolanaTransactionSocketListener solListener)
        {
            _solListener = solListener;
            _solSettings = solSettings.Value;
            _rpcClient = ClientFactory.GetClient(
                cluster: _solSettings.UseDevelopingSolanaCluster
                    ? Cluster.DevNet
                    : Cluster.MainNet,
                logger: loggerFactory.CreateLogger("SolanaRpcClient")
            );
            _logger = loggerFactory.CreateLogger<SolanaTransactionManager<TObject>>();
            _account = new Account(_solSettings.WalletPrivateKey, _solSettings.WalletPublicKey);
        }

        internal async Task<byte[]?> SendObjectAsync(TObject obj)
        {
            if (!_solListener.IsConnectionAlive) 
                return null;

            var slices = SliceObject(obj);
            var tasks = slices.Select(s => SendMessageAsync(s));
            var signatures = await Task.WhenAll(tasks);

            var success = signatures?.All(s => s != null) ?? false;
            if (!success)
            {
                _logger.LogCritical("Failed to write object of type {t} to blockchain", typeof(TObject).Name);
                return null;
            }

            _logger.LogInformation("Successfully wrote object of type {t} to blockchain", typeof(TObject).Name);
            return signatures!
                .SelectMany(s => Encoders.Base58.DecodeData(s!))
                .ToArray();
        }

        private List<string> SliceObject(TObject obj)
        {
            var objectType = typeof(TObject).Name;
            var serializedObj = JsonSerializer.Serialize(obj);
            var wrappedObj = new DataWrapper(objectType, serializedObj);
            var serializedWrappedObj = wrappedObj.Serialize();

            if (serializedWrappedObj.Length <= MAX_TRANSACTION_LENGTH)
                return new List<string> { serializedWrappedObj };

            var wrapLength = serializedWrappedObj.Length - serializedObj.Length;
            var chunkLength = MAX_TRANSACTION_LENGTH - wrapLength;

            var parts = (int)Math.Ceiling((double)serializedObj.Length / chunkLength);

            if (parts > MAX_TRANSACTION_COUNT)
                throw new ObjectTooLargeException();

            var slicedObj = new List<string>(parts);

            for (int i = 0; i < parts; i++)
            {
                int length = Math.Min(chunkLength, serializedObj.Length - i * chunkLength);
                string chunkData = serializedObj.Substring(i * chunkLength, length);

                var chunkDataWrapper = new DataWrapper(objectType, chunkData, i);
                var serializedChunkDataWrapper = chunkDataWrapper.Serialize();

                slicedObj.Add(serializedChunkDataWrapper);
            }
            return slicedObj;
        }

        private async Task<string?> SendMessageAsync(string message)
        {
            int retriesCount = 0;

            while (retriesCount < MAX_REQUESTS_RETRIES)
            {
                retriesCount++;

                var recentHash = await _rpcClient.GetLatestBlockHashAsync();
                if (!recentHash.WasSuccessful || recentHash.Result?.Value?.Blockhash == null)
                {
                    _logger.LogWarning("Failed to get recent blockhash, error: {e}",
                        JsonSerializer.Serialize(recentHash.ErrorData));
                    continue;
                }

                var memoInstruction = MemoProgram.NewMemo(_account, message);

                try
                {
                    var tx = new TransactionBuilder()
                       .SetFeePayer(_account)
                       .AddInstruction(ComputeBudgetProgram.SetComputeUnitLimit(TRANSACTION_COMPUTING_UNITS))
                       .AddInstruction(memoInstruction)
                       .SetRecentBlockHash(recentHash.Result.Value.Blockhash)
                       .Build(_account);

                    var sendingResponse = await _rpcClient.SendTransactionAsync(tx);

                    if (!sendingResponse.WasSuccessful)
                    {
                        _logger.LogWarning("Failed to send transaction, error: {e}, retry {retry}/{max}",
                            JsonSerializer.Serialize(sendingResponse.ErrorData), retriesCount, MAX_TRANSACTION_COUNT);
                        continue;
                    }

                    var confirmResult = await _solListener.WaitTransactionConfirmation(sendingResponse.Result);

                    if (confirmResult == TransactionResult.Rejected)
                    {
                        _logger.LogWarning("Transaction {sig} failed to confirm, retry {retry}/{max}",
                            sendingResponse.Result, retriesCount, MAX_REQUESTS_RETRIES);
                        continue;
                    }

                    if (confirmResult == TransactionResult.NotAwaited)
                        return null;

                    return sendingResponse.Result;
                }
                catch 
                {
                    return null; 
                }               
            }

            _logger.LogCritical("Failed to send message {message}", message);
            return null;
        }
    }
}
