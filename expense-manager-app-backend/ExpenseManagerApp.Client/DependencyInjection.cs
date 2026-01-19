using System;
using Microsoft.Extensions.DependencyInjection;

namespace ExpenseManagerApp.Client
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddExpenseManagerClient(this IServiceCollection services, Uri baseAddress)
        {
            services.AddHttpClient<IAccountClient, AccountClient>(client =>
            {
                client.BaseAddress = baseAddress;
            });

            services.AddHttpClient<IExpenseClient, ExpenseClient>(client =>
            {
                client.BaseAddress = baseAddress;
            });

            return services;
        }

        public static IServiceCollection AddExpenseManagerClient(this IServiceCollection services, string baseAddress)
        {
            return services.AddExpenseManagerClient(new Uri(baseAddress));
        }
    }
}
