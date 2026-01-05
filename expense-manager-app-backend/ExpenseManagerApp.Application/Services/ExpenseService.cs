using System.Collections.Generic;
using System.Threading.Tasks;
using ExpenseManagerApp.Domain.Entities;
using ExpenseManagerApp.Domain.Interfaces;

namespace ExpenseManagerApp.Application.Services
{
    public class ExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpenseService(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        public async Task<IEnumerable<Expense>> GetMonthlyExpensesAsync(int accountId, int year, int month)
        {
            return await _expenseRepository.GetExpensesByAccountIdAndMonthAsync(accountId, year, month);
        }

        public async Task AddExpenseAsync(Expense expense)
        {
            // Could add more validation here
            await _expenseRepository.AddAsync(expense);
        }
    }
}
