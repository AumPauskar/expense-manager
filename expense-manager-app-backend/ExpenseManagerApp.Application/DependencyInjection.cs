using ExpenseManagerApp.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ExpenseManagerApp.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<AccountService>();
            services.AddScoped<ExpenseService>();
            
            return services;
        }
    }
}
