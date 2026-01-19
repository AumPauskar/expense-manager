namespace ExpenseManagerApp.Domain.Entities
{
    public class Account
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public int Privileges { get; private set; } = 1;
    }
}
