using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ExpenseManagerApp.Api.Middleware
{
    public class AccountMiddleware
    {
        private readonly RequestDelegate _next;

        public AccountMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Simple demonstration: check for a custom header
            // In a real scenario, this would validate a token
            if (context.Request.Headers.TryGetValue("X-Account-Id", out var accountIdVal) && int.TryParse(accountIdVal, out int accountId))
            {
                context.Items["AccountId"] = accountId;
            }

            await _next(context);
        }
    }
}
