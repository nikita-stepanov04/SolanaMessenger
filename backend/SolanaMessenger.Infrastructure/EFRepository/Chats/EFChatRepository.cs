using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFChatRepository : EFRepositoryBase<Chat>, IChatRepository
    {
        public EFChatRepository(EFDataContext context)
            : base(context) { }

        public Task<List<Chat>> GetAllByUserIDAsync(Guid userID)
        {
            return DbSet.Where(c => c.Users.Any(u => u.ID == userID)).ToListAsync();
        }

        public Task<bool> IsUserAChatMemberAsync(Guid chatID, Guid userID)
        {
            return DbSet.AnyAsync(
                ch => ch.ID == chatID &&
                ch.Users.Any(u => u.ID == userID)
            );
        }

        public async Task<List<Guid>> GetChatUserIDsAsync(Guid chatID)
        {
            return await DbSet.Where(c => c.ID == chatID)
                .SelectMany(c => c.Users.Select(u => u.ID))
                .ToListAsync();
        }
    }
}
