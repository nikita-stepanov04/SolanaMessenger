namespace SolanaMessenger.Infrastructure.Blockchain
{
    public interface IBlockchainRepository<TObject> where TObject : class, new()
    {
        Task<byte[]?> WriteObjectAsync(TObject obj);

        Task<TObject?> GetObjectAsync(byte[] signatures);
    }
}
