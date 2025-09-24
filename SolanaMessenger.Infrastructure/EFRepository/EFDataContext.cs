using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFDataContext : DbContext
    {
        public EFDataContext(DbContextOptions options) 
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<InvalidatedToken> InvalidatedTokens => Set<InvalidatedToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            new EFOnUserModelCreating().OnModelCreating(modelBuilder);
            new EFOnInvalidatedTokenModelCreating().OnModelCreating(modelBuilder);
        }
    }
}
