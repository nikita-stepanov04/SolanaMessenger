using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFDataContext : DbContext
    {
        public EFDataContext(DbContextOptions options) 
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Chat> Chats => Set<Chat>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<InvalidatedToken> InvalidatedTokens => Set<InvalidatedToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(EFDataContext).Assembly);
        }
    }
}
