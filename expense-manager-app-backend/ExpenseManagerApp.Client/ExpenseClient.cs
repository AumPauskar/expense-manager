using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using ExpenseManagerApp.Application.DTOs;
using ExpenseManagerApp.Domain.Entities;

namespace ExpenseManagerApp.Client
{
    public class ExpenseClient : IExpenseClient
    {
        private readonly HttpClient _httpClient;

        public ExpenseClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Expense>?> GetMonthlyExpensesAsync(int accountId, int year, int month)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"api/Expense/{year}/{month}");
            request.Headers.Add("X-Account-Id", accountId.ToString());

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<IEnumerable<Expense>>();
            }

            return null;
        }

        public async Task<Expense?> AddExpenseAsync(int accountId, AddExpenseDto expenseDto)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "api/Expense");
            request.Headers.Add("X-Account-Id", accountId.ToString());
            request.Content = JsonContent.Create(expenseDto);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Expense>();
            }

            return null;
        }
    }
}
