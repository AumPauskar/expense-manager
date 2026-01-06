# Expense Manager Backend

## 1. Setup Database
Ensure Docker is installed and running.
```bash
cd expense-manager-app-backend
docker-compose up -d
```

## 2. Apply Migrations
Execute the following to setup the database schema:
```bash
dotnet ef migrations add InitialCreate --project ExpenseManagerApp.Infrastructure --startup-project ExpenseManagerApp.Api
dotnet ef database update --project ExpenseManagerApp.Infrastructure --startup-project ExpenseManagerApp.Api
```

## 3. Run the API
```bash
cd ExpenseManagerApp.Api
dotnet run
```
The API will be available at `http://localhost:5037` (or port specified in output).

## 4. Test Endpoints

### Register Account
```bash
curl -X POST "http://localhost:5037/api/Account/register?username=testuser&password=password123"
```

### Login
```bash
curl -X POST "http://localhost:5037/api/Account/login?username=testuser&password=password123"
```
Response: `{ "id": 1, "username": "testuser", ... }`

### Add Expense
Use the `id` from login as `X-Account-Id` header.
```bash
curl -X POST "http://localhost:5037/api/Expense" \
     -H "Content-Type: application/json" \
     -H "X-Account-Id: 1" \
     -d '{
           "name": "Groceries",
           "transactionAmount": 50,
           "required": true,
           "cash": false,
           "spent": true
         }'
```

### Get Monthly Expenses
```bash
curl -X GET "http://localhost:5037/api/Expense/2026/1" \
     -H "X-Account-Id: 1"
```
