using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Solnet.Rpc;
using Solnet.Rpc.Core.Sockets;
using Solnet.Rpc.Types;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text.Json;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaTransactionSocketListener : IDisposable
    {
        private const int AWAITING_TIMEOUT = 30 * 1000;
        private const int SOCKET_RECONNECT_TIME = 5 * 1000;
        private const string DEV_WSS_ENDPOINT = "wss://api.devnet.solana.com";
        private const string MAIN_WSS_ENDPOINT = "wss://api.mainnet-beta.solana.com";

        private IStreamingRpcClient? _wssClient;
        private SubscriptionState? _subscriptionState;

        private readonly ILogger _logger;
        private readonly SolanaSettings _settings;
        private readonly ConcurrentDictionary<string, EventWaitingPayload> _pendingSignatures = new();

        public bool IsConnectionAlive { get; private set; }

        public SolanaTransactionSocketListener(ILoggerFactory loggerFactory, IOptions<SolanaSettings> solOpts)
        {
            _logger = loggerFactory.CreateLogger<SolanaTransactionSocketListener>();
            _settings = solOpts.Value;
            StartConnection();            
        }

        internal Task<TransactionResult> WaitTransactionConfirmation(string signature)
        {
            var payload = new EventWaitingPayload
            {
                Tcs = new TaskCompletionSource<TransactionResult>(TaskCreationOptions.RunContinuationsAsynchronously),
                Cts = new CancellationTokenSource(AWAITING_TIMEOUT)
            };

            payload.Ctr = payload.Cts.Token.Register(() =>
            {
                if (_pendingSignatures.TryRemove(signature, out var ewp))
                {
                    using (ewp)
                    {
                        _logger.LogWarning("Timeout reached: no confirmation event received for transaction {t}", signature);
                        ewp.Tcs.TrySetResult(TransactionResult.NotAwaited);
                    }
                }
            }, useSynchronizationContext: false);

            if (!_pendingSignatures.TryAdd(signature, payload))
                throw new InvalidOperationException("Signature has been already registered");
            return payload.Tcs.Task;
        }

        private void StartConnection()
        {
            try
            {
                string endpoint = _settings.UseDevelopingSolanaCluster ? DEV_WSS_ENDPOINT : MAIN_WSS_ENDPOINT;
                _wssClient = ClientFactory.GetStreamingClient(endpoint);
                _wssClient.ConnectAsync().Wait();

                IsConnectionAlive = true;
                _logger.LogInformation("Solana RPC Streaming listener successfully connected to: {e}", endpoint);

                _subscriptionState = _wssClient.SubscribeLogInfo(
                    _settings.WalletPublicKey,
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
                                ewp?.Tcs.TrySetResult(isOk ? TransactionResult.Confirmed : TransactionResult.Rejected);
                            }
                        }
                    },
                    Commitment.Confirmed
                );

                _wssClient!.ConnectionStateChangedEvent += (_, status) =>
                {
                    if (status == WebSocketState.CloseReceived || status == WebSocketState.Aborted)
                    {
                        IsConnectionAlive = false;
                        _logger.LogWarning($"Connection status: {status.ToString()}, stopping all listening tasks, trying to reconnect");

                        foreach (var kvp in _pendingSignatures.ToList())
                        {
                            _pendingSignatures.TryRemove(kvp.Key, out var ewp);
                            using (ewp)
                            {
                                ewp?.Tcs.TrySetResult(TransactionResult.NotAwaited);
                            }
                        }

                        int counter = 1;
                        while (true)
                        {
                            _logger.LogWarning($"Connection try: {counter++}");
                            StartConnection();

                            if (IsConnectionAlive)
                                break;

                            _logger.LogWarning($"Reconnect after : {SOCKET_RECONNECT_TIME}ms");
                            Thread.Sleep(SOCKET_RECONNECT_TIME);
                        }
                    }
                };
            }
            catch (AggregateException ex)
            {
                _logger.LogCritical("Failed to start transaction listener: {ex}",
                    ex.InnerException?.Message);
            }
        }

        public void Dispose()
        {
            IsConnectionAlive = false;
            _wssClient?.Unsubscribe(_subscriptionState);
            _logger.LogInformation("Solana RPC Streaming listener successfully closed connection");
        }
    }

    internal class EventWaitingPayload : IDisposable
    {
        public CancellationTokenRegistration Ctr { get; set; }
        public CancellationTokenSource Cts { get; set; } = null!;
        public TaskCompletionSource<TransactionResult> Tcs { get; set; } = null!;

        public void Dispose()
        {
            Cts?.Dispose();
            Ctr.Dispose();
        }
    }

    internal enum TransactionResult
    {
        Confirmed = 0,
        Rejected = 1,
        NotAwaited = 2
    }
}
