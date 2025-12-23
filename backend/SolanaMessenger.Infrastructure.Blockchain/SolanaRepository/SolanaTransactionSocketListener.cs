using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Solnet.Rpc;
using Solnet.Rpc.Core.Sockets;
using Solnet.Rpc.Types;
using System.Collections.Concurrent;
using System.Text.Json;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaTransactionSocketListener : IDisposable
    {
        private const int AWAITING_TIMEOUT = 30 * 1000; // seconds
        private const string DEV_WSS_ENDPOINT = "wss://api.devnet.solana.com";
        private const string MAIN_WSS_ENDPOINT = "wss://api.mainnet-beta.solana.com";

        private readonly IStreamingRpcClient? _wssClient;
        private readonly SubscriptionState? _subscriptionState;

        private readonly ILogger _logger;
        private readonly ConcurrentDictionary<string, EventWaitingPayload> _pendingSignatures = new();

        public SolanaTransactionSocketListener(ILoggerFactory loggerFactory, IOptions<SolanaSettings> solOpts)
        {
            var solSettings = solOpts.Value;

            string endpoint = solSettings.UseDevelopingSolanaCluster ? DEV_WSS_ENDPOINT : MAIN_WSS_ENDPOINT;

            _logger = loggerFactory.CreateLogger<SolanaTransactionSocketListener>();

            try
            {
                _wssClient = ClientFactory.GetStreamingClient(endpoint);
                _wssClient.ConnectAsync().Wait();

                _logger.LogInformation("Solana RPC Streaming listener successfully connected to: {e}", endpoint);

                _subscriptionState = _wssClient.SubscribeLogInfo(
                    solSettings.WalletPublicKey,
                    (state, result) =>
                    {
                        var signature = result.Value.Signature;
                        if (signature != null)
                        {
                            bool isOk = result.Value.Error == null;

                            if (isOk)
                                _logger.LogInformation("Event received => Transaction {t} has been confirmed", signature);
                            else
                                _logger.LogWarning("Event received => Transaction {t} was not confirmed, error: {e}",
                                    signature, JsonSerializer.Serialize(result.Value.Error));

                            _pendingSignatures.TryRemove(signature, out var ewp);
                            using (ewp)
                            {
                                ewp?.Tcs.TrySetResult(isOk);
                            }
                        }
                    },
                    Commitment.Confirmed
                );
            }
            catch (Exception ex)
            {
                _logger.LogCritical("Failed to start transaction listener because of exception of type: {exType}",
                    ex.GetType().Name);
            }
        }

        internal Task<bool> WaitTransactionConfirmation(string signature)
        {
            var payload = new EventWaitingPayload
            {
                Tcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously),
                Cts = new CancellationTokenSource(AWAITING_TIMEOUT)
            };

            payload.Ctr = payload.Cts.Token.Register(() =>
            {
                if (_pendingSignatures.TryRemove(signature, out var ewp))
                {
                    using (ewp)
                    {
                        _logger.LogWarning("Timeout reached: no confirmation event received for transaction {t}", signature);
                        ewp.Tcs.TrySetResult(false);
                    }
                }
            }, useSynchronizationContext: false);

            if (!_pendingSignatures.TryAdd(signature, payload))
                throw new InvalidOperationException("Signature has been already registered");

            return payload.Tcs.Task;
        }

        public void Dispose()
        {
            _wssClient?.Unsubscribe(_subscriptionState);
            _logger.LogInformation("Solana RPC Streaming listener successfully closed connection");
        }

        private class EventWaitingPayload : IDisposable
        {
            public CancellationTokenRegistration Ctr { get; set; }
            public CancellationTokenSource Cts { get; set; } = null!;
            public TaskCompletionSource<bool> Tcs { get; set; } = null!;

            public void Dispose()
            {
                Cts?.Dispose();
                Ctr.Dispose();
            }
        }
    }
}
