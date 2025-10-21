using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;
using SolanaMessenger.Infrastructure.EFRepository.Chats;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFDataContext : DbContext
    {
        public EFDataContext(DbContextOptions options) 
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Chat> Chats => Set<Chat>();
        public DbSet<InvalidatedToken> InvalidatedTokens => Set<InvalidatedToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            new EFOnChatModelCreating().OnModelCreating(modelBuilder);
            new EFOnUserModelCreating().OnModelCreating(modelBuilder);
            new EFOnInvalidatedTokenModelCreating().OnModelCreating(modelBuilder);
        }
    }
}
