using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure
{
    public interface IInvalidatedTokenRepository : IRepositoryBase<InvalidatedToken>
    {
        Task<bool> IsTokenPresentAsync(string tokenId);
    }
}
