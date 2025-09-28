namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaRepository<TObject> : IBlockchainRepository<TObject>
        where TObject : class, new()
    {
        private readonly SolanaTransactionManager<TObject> _transactionManager;

        internal SolanaRepository(SolanaTransactionManager<TObject> transactionManager)
        {
            _transactionManager = transactionManager;
        }

        public Task<TObject> GetObjectAsync(List<string> signatures)
        {
            throw new NotImplementedException();
        }

        public async Task<List<string>> WriteObjectAsync(TObject obj)
        {
            return await _transactionManager.SendObjectAsync(obj);
        }
    }
}
