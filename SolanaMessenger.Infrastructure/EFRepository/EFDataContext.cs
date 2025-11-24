using Microsoft.EntityFrameworkCore;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFDataContext : DbContext
    {
        public EFDataContext(DbContextOptions options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(EFDataContext).Assembly);
        }
    }
}
