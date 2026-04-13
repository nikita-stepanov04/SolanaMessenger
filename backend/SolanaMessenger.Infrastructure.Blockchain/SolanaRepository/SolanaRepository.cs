using SolanaMessenger.Infrastructure.Blockchain.SolanaRepository.Read.Helius;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaRepository<TObject> : IBlockchainRepository<TObject>
        where TObject : class, new()
    {
        private readonly SolanaTransactionWriter<TObject> _transactionWriter;
        private readonly HeliusSolanaTransactionReader<TObject> _transactionReader;

        public SolanaRepository(
            SolanaTransactionWriter<TObject> transactionManager,
            HeliusSolanaTransactionReader<TObject> transactionFetcher)
        {
            _transactionWriter = transactionManager;
            _transactionReader = transactionFetcher;
        }

        public async Task<TObject?> GetObjectAsync(byte[] signatures)
        {
            return await _transactionReader.GetObjectAsync(signatures);
        }

        public async Task<byte[]?> WriteObjectAsync(TObject obj)
        {
            return await _transactionWriter.SendObjectAsync(obj);
        }
    }
}
