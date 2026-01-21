using ExpenseManagerApp.Domain.Entities;
using System.Threading.Tasks;

namespace ExpenseManagerApp.Client
{
    public interface IAccountClient
    {
        Task<Account?> RegisterAsync(string username, string password);
        Task<Account?> LoginAsync(string username, string password);
        Task<Account?> GetAccountByIdAsync(int id);
        Task<string?> DeleteAccountByIdAsync(int id, string username, string password);
    }
}
