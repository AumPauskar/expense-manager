using ExpenseManagerApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManagerApp.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Basic configuration if needed, e.g., constraints
            modelBuilder.Entity<Account>().HasIndex(a => a.Username).IsUnique();
        }
    }
}
