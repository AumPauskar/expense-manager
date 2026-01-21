using ExpenseManagerApp.Application.DTOs;
using ExpenseManagerApp.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExpenseManagerApp.Client
{
    public interface IExpenseClient
    {
        Task<IEnumerable<Expense>?> GetMonthlyExpensesAsync(int accountId, int year, int month);
        Task<Expense?> AddExpenseAsync(int accountId, AddExpenseDto expenseDto);
    }
}
