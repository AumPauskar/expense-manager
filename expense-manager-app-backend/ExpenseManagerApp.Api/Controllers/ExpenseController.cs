using System;
using System.Threading.Tasks;
using ExpenseManagerApp.Application.Services;
using ExpenseManagerApp.Domain.Entities;
using ExpenseManagerApp.Application.DTOs;
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
        public async Task<IActionResult> AddExpense([FromBody] AddExpenseDto expenseDto)
        {
            if (HttpContext.Items["AccountId"] is not int accountId)
                return Unauthorized("Please provide X-Account-Id header");

            var expense = new Expense
            {
                AccountId = accountId,
                Name = expenseDto.Name,
                Required = expenseDto.Required,
                Cash = expenseDto.Cash,
                Spent = expenseDto.Spent,
                TransactionAmount = expenseDto.TransactionAmount,
                Date = expenseDto.Date ?? DateTime.UtcNow
            };

            await _expenseService.AddExpenseAsync(expense);
            return Ok(expense);
        }
    }
}
