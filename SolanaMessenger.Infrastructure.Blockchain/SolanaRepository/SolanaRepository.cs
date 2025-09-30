namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaRepository<TObject> : IBlockchainRepository<TObject>
        where TObject : class, new()
    {
        private readonly SolanaTransactionManager<TObject> _transactionManager;
        private readonly HeliusTransactionFetcher<TObject> _transactionFetcher;

        public SolanaRepository(
            SolanaTransactionManager<TObject> transactionManager,
            HeliusTransactionFetcher<TObject> transactionFetcher)
        {
            _transactionManager = transactionManager;
            _transactionFetcher = transactionFetcher;
        }

        public async Task<TObject> GetObjectAsync(List<string> signatures)
        {
            return await _transactionFetcher.GetObjectAsync(signatures);
        }

        public async Task<List<string>> WriteObjectAsync(TObject obj)
        {
            return await _transactionManager.SendObjectAsync(obj);
        }
    }
}
