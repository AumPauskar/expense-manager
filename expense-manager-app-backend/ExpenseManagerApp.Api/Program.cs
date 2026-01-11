using ExpenseManagerApp.Api.Middleware;
using ExpenseManagerApp.Application;
using ExpenseManagerApp.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add AWS Lambda Hosting
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

// Add Layers
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod());

app.UseAuthorization();

app.UseMiddleware<AccountMiddleware>();

app.MapControllers();

// Apply migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ExpenseManagerApp.Infrastructure.Data.ApplicationDbContext>();
    // This will create the database if it doesn't exist and apply pending migrations
    // Note: ensure Microsoft.EntityFrameworkCore is imported if needed, usually available via dbContext
    dbContext.Database.EnsureCreated(); 
    // Or use Migrate() if you have migrations: dbContext.Database.Migrate();
}

app.Run();
