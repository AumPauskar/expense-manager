using System;

namespace ExpenseManagerApp.Application.DTOs
{
    public class AddExpenseDto
    {
        public string? Name { get; set; }
        public bool Required { get; set; }
        public bool Cash { get; set; }
        public bool Spent { get; set; }
        public int TransactionAmount { get; set; }
        public DateTime? Date { get; set; }
    }
}
