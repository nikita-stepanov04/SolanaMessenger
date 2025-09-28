namespace SolanaMessenger.Infrastructure.Blockchain
{
    public interface IBlockchainRepository<TObject> where TObject : class, new()
    {
        Task<List<string>> WriteObjectAsync(TObject obj);

        Task<TObject> GetObjectAsync(List<string> signatures);
    }
}
