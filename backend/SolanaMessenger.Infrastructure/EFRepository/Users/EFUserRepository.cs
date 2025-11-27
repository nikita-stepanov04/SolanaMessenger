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
            return DbSet.Where(u => u.Login == login).FirstOrDefaultAsync();
        }

        public Task<List<User>> GetByIDsAsync(List<Guid> usersIDs)
        {
            return DbSet.Where(u => usersIDs.Contains(u.ID)).ToListAsync();
        }
    }
}
