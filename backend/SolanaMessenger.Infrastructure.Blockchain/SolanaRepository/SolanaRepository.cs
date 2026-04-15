namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    public class SolanaRepository<TObject> : IBlockchainRepository<TObject>
        where TObject : class, new()
    {
        private readonly SolanaTransactionWriter<TObject> _transactionWriter;
        private readonly SolanaTransactionReader<TObject> _transactionReader;

        public SolanaRepository(
            SolanaTransactionWriter<TObject> transactionWriter,
            SolanaTransactionReader<TObject> transactionReader)
        {
            _transactionWriter = transactionWriter;
            _transactionReader = transactionReader;
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
