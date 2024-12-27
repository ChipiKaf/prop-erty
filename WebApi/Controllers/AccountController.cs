using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        private string GenerateJwtToken(string email)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            
            var keyString = _config["JWT:Key"]
                ?? throw new InvalidOperationException("JWT:Key is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
             );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Signup([FromBody] SignUpModel model) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if password and confirmPassword match
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { Message = "Password and Confirm Password do not match." });
            }


            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded) 
            {
                return Ok(new { Message = "User registered Successfully" });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (result.Succeeded)
            {
                var token = GenerateJwtToken(model.Email);
                return Ok(new { Token = token, Message = "Login successful" });
            }

            return Unauthorized(new { Message = "Invalid email or password." });
        }

        
        public class SignUpModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string ConfirmPassword { get; set; }
        }

        public class LoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
