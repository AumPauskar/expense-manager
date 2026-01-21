using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Web;
using ExpenseManagerApp.Domain.Entities;

namespace ExpenseManagerApp.Client
{
    public class AccountClient : IAccountClient
    {
        private readonly HttpClient _httpClient;

        public AccountClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Account?> RegisterAsync(string username, string password)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["username"] = username;
            query["password"] = password;
            
            var response = await _httpClient.PostAsync($"api/Account/register?{query}", null);
            
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Account>();
            }
            
            // Handle specific status codes or return null on failure
            return null;
        }

        public async Task<Account?> LoginAsync(string username, string password)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["username"] = username;
            query["password"] = password;

            var response = await _httpClient.PostAsync($"api/Account/login?{query}", null);
            
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Account>();
            }

            return null;
        }

        public async Task<Account?> GetAccountByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"dev/api/dev/account/{id}");
            
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Account>();
            }

            return null;
        }

        public async Task<string?> DeleteAccountByIdAsync(int id, string username, string password)
        {
            var query = HttpUtility.ParseQueryString(string.Empty);
            query["username"] = username;
            query["password"] = password;

            var response = await _httpClient.DeleteAsync($"dev/api/dev/account/{id}?{query}");
            
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }

            return null;
        }
    }
}
