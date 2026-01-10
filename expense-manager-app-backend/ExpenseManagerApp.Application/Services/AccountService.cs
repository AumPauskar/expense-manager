using ExpenseManagerApp.Domain.Entities;
using ExpenseManagerApp.Domain.Interfaces;

namespace ExpenseManagerApp.Application.Services
{
    public class AccountService
    {
        private readonly IAccountRepository _accountRepository;

        public AccountService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<Account> RegisterAsync(string username, string password)
        {
            var existing = await _accountRepository.GetByUsernameAsync(username.ToLowerInvariant());
            if (existing != null)
                throw new Exception("Username already exists");

            var account = new Account
            {
                Username = username.ToLowerInvariant(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            await _accountRepository.AddAsync(account);
            return account;
        }

        public async Task<Account?> LoginAsync(string username, string password)
        {
            var account = await _accountRepository.GetByUsernameAsync(username);
            if (account == null || !BCrypt.Net.BCrypt.Verify(password, account.PasswordHash))
                return null;

            return account;
        }

        public async Task<Account?> DeleteAsync(int id, string username, string password)
        {
            var account = await _accountRepository.GetByUsernameAsync(username);
            if (account == null || password != account.PasswordHash || username != account.Username)
            {
                Console.WriteLine($"Password: {password}, Account Password: {account?.PasswordHash}");
                Console.WriteLine($"Username: {username}, Account Username: {account?.Username}");
                return null;
            }

            await _accountRepository.DeleteAsync(id);
            return account;
        }

        public async Task<Account?> GetByIdAsync(int id)
        {
            return await _accountRepository.GetByIdAsync(id);
        }
    }
}
