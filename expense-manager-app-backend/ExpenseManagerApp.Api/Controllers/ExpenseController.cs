using System;
using System.Threading.Tasks;
using ExpenseManagerApp.Application.Services;
using ExpenseManagerApp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseManagerApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly ExpenseService _expenseService;

        public ExpenseController(ExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet("{year}/{month}")]
        public async Task<IActionResult> GetMonthlyExpenses(int year, int month)
        {
            if (HttpContext.Items["AccountId"] is not int accountId)
                return Unauthorized("Please provide X-Account-Id header");

            var expenses = await _expenseService.GetMonthlyExpensesAsync(accountId, year, month);
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] Expense expense)
        {
            if (HttpContext.Items["AccountId"] is not int accountId)
                return Unauthorized("Please provide X-Account-Id header");

            // Override AccountId from context to ensure security
            expense.AccountId = accountId;
            
            // Set date to now if not provided or just rely on input
            if (expense.Date == default)
                expense.Date = DateTime.UtcNow;

            await _expenseService.AddExpenseAsync(expense);
            return Ok(expense);
        }
    }
}
