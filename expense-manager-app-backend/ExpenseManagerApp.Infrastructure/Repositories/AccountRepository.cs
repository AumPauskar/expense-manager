using System.Threading.Tasks;
using ExpenseManagerApp.Domain.Entities;
using ExpenseManagerApp.Domain.Interfaces;
using ExpenseManagerApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManagerApp.Infrastructure.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _context;

        public AccountRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Account> GetByUsernameAsync(string username)
        {
            return await _context.Accounts.FirstOrDefaultAsync(a => a.Username == username);
        }

        public async Task<Account> GetByIdAsync(int id)
        {
            return await _context.Accounts.FindAsync(id);
        }

        public async Task AddAsync(Account account)
        {
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();
        }
    }
}
