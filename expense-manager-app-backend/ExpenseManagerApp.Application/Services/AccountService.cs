using System;
using System.Threading.Tasks;
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
            // Basic validation
            var existing = await _accountRepository.GetByUsernameAsync(username);
            if (existing != null)
                throw new Exception("Username already exists");

            // In a real app, hash the password
            var account = new Account
            {
                Username = username,
                PasswordHash = password // TODO: Hash this
            };

            await _accountRepository.AddAsync(account);
            return account;
        }

        public async Task<Account> LoginAsync(string username, string password)
        {
            var account = await _accountRepository.GetByUsernameAsync(username);
            if (account == null || account.PasswordHash != password) // TODO: Verify hash
                return null;

            return account;
        }

        public async Task<Account> GetByIdAsync(int id)
        {
            return await _accountRepository.GetByIdAsync(id);
        }
    }
}
