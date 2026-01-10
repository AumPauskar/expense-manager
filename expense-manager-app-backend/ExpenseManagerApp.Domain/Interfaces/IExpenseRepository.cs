using ExpenseManagerApp.Domain.Entities;

namespace ExpenseManagerApp.Domain.Interfaces
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Expense>> GetExpensesByAccountIdAndMonthAsync(int accountId, int year, int month);
        Task AddAsync(Expense expense);
    }
}
