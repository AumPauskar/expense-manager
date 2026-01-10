using System;

namespace ExpenseManagerApp.Domain.Entities
{
    public class Expense
    {
        public required int Id { get; set; }
        public required int AccountId { get; set; }
        public string? Name { get; set; }
        public bool Required { get; set; }
        public bool Cash { get; set; }
        public bool Spent { get; set; }
        public int TransactionAmount { get; set; }
        public DateTime Date { get; set; }
        
        public required Account Account { get; set; }
    }
}
