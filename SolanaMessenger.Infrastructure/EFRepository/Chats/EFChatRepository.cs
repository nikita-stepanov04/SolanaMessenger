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
            return DbContext.Chats.Where(c => c.Users.Any(u => u.ID == userID)).ToListAsync();
        }
    }
}
