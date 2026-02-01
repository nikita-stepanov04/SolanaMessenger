using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFMessageRepository : EFRepositoryBase<Message>, IMessageRepository
    {
        public EFMessageRepository(EFDataContext context)
            : base(context) { }

        public Task<List<Message>> GetMessagesAsync(Guid chatID, int count, long lastMessageTimestamp = 0)
        {
            return DbSet.Where(m => m.ChatID == chatID
                && (lastMessageTimestamp == 0 || m.Timestamp < lastMessageTimestamp))
                .OrderByDescending(m => m.Timestamp)
                .Take(count)
                .ToListAsync();
        }
    }
}
