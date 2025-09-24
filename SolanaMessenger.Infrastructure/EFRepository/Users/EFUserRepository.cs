using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFUserRepository : EFRepositoryBase<User>, IUserRepository
    {
        public EFUserRepository(EFDataContext context) 
            : base(context) { }

        public async Task<User?> GetByLoginAsync(string login)
        {
            return await DbContext.Users.Where(u => u.Login == login).FirstOrDefaultAsync();
        }
    }
}
