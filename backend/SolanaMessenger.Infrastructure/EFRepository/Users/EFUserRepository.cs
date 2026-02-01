using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFUserRepository : EFRepositoryBase<User>, IUserRepository
    {
        public EFUserRepository(EFDataContext context)
            : base(context) { }

        public Task<User?> GetByLoginAsync(string login)
        {
            return DbSet.FirstOrDefaultAsync(u => EF.Functions.ILike(u.Login, login));
        }

        public Task<List<User>> GetByIDsAsync(List<Guid> usersIDs)
        {
            return DbSet.Where(u => usersIDs.Contains(u.ID)).ToListAsync();
        }

        public async Task<List<User>> GetByLoginSubstring(string loginSubstring, int count)
        {
            return await DbSet
                .Where(u => EF.Functions.ILike(u.Login, $"%{loginSubstring}%"))
                .OrderBy(u => u.Login)
                .Take(count)
                .ToListAsync();
        }
    }
}
