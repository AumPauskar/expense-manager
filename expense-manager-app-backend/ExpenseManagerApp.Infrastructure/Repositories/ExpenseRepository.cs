using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExpenseManagerApp.Domain.Entities;
using ExpenseManagerApp.Domain.Interfaces;
using ExpenseManagerApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManagerApp.Infrastructure.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly ApplicationDbContext _context;

        public ExpenseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Expense>> GetExpensesByAccountIdAndMonthAsync(int accountId, int year, int month)
        {
            return await _context.Expenses
                .Where(e => e.AccountId == accountId && e.Date.Year == year && e.Date.Month == month)
                .ToListAsync();
        }

        public async Task AddAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
        }
    }
}
