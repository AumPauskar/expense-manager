using ExpenseManagerApp.Domain.Entities;

namespace ExpenseManagerApp.Domain.Interfaces
{
    public interface IAccountRepository
    {
        Task<Account?> GetByUsernameAsync(string username);
        Task<Account?> GetByIdAsync(int id);
        Task AddAsync(Account account);
        Task DeleteAsync(int id);
    }
}
