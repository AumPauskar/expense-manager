using System.Threading.Tasks;
using ExpenseManagerApp.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseManagerApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly AccountService _accountService;

        public AccountController(AccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string username, string password)
        {
            try
            {
                var account = await _accountService.RegisterAsync(username, password);
                return Ok(account);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            var account = await _accountService.LoginAsync(username, password);
            if (account == null)
                return Unauthorized("Invalid credentials");
            
            return Ok(account);
        }
    }

    [ApiController]
    [Route("dev/api/[controller]")]
    public class DevAccountController : ControllerBase
    {
        private readonly AccountService _accountService;

        public DevAccountController(AccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("dev/account/{id}")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var account = await _accountService.GetByIdAsync(id);
            if (account == null)
                return NotFound("Account not found");

            return Ok(account);
        }

        [HttpDelete("dev/account/{id}")]
        public async Task<IActionResult> DeleteAccountById(int id, string username, string password)
        {
            var account = await _accountService.DeleteAsync(id, username, password);
            if (account == null)
                return NotFound("Account not found or invalid credentials");

            return Ok($"Account with ID {id} deleted.");
        }
    }
}
