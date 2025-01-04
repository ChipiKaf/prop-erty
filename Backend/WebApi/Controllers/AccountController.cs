using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebApi.DataAccess.Dtos;
using WebApi.DataAccess.Interfaces;
using WebApi.DataAccess.Repository;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly IAntiforgery _antiforgery;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AccountController(UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager,
            IUnitOfWork uow,
            IAntiforgery antiforgery,
            IConfiguration config,
            IWebHostEnvironment webHostEnvironment)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _uow = uow;
            _antiforgery = antiforgery;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("antiforgery/token")]
        public IActionResult GetAntiforgeryToken()
        {
            var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
            Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!,
                new CookieOptions
                {
                    HttpOnly = false,
                    Secure = !_webHostEnvironment.IsDevelopment(),
                    SameSite = _webHostEnvironment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
                    Domain = _webHostEnvironment.IsDevelopment() ? null : ".chipilidev.com",
                    Path = "/"
                }

                );
            return NoContent();
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
        public async Task<IActionResult> Signup([FromBody] SignUpDto model) 
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
                await _signInManager.SignInAsync(user, isPersistent: false);
                //var token = GenerateJwtToken(model.Email);
                var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
                Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!,
                    new CookieOptions
                    {
                        HttpOnly = false,
                        Secure = !_webHostEnvironment.IsDevelopment(),
                        SameSite = _webHostEnvironment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
                        Domain = _webHostEnvironment.IsDevelopment() ? null : ".chipilidev.com",
                        Path = "/"
                    }
                    );
                return Ok(new { Message = "Registration successful and user is logged in" });

            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);

        }
        [HttpGet("check-auth")]
        public IActionResult CheckAuth()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new { isAuthenticated = true, user = User.Identity.Name });
            }
            return Ok(new { isAuthenticated = false });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (result.Succeeded)
            {
                var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
                Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!,
                    new CookieOptions
                    {
                        HttpOnly = false, // Accessible via JavaScript
                        Secure = !_webHostEnvironment.IsDevelopment(),
                        SameSite = _webHostEnvironment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
                        Domain = _webHostEnvironment.IsDevelopment() ? null : ".chipilidev.com",
                        Path = "/"
                    });
                return Ok(new { Message = "Login successful" });
            }

            return Unauthorized(new { Message = "Invalid email or password." });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            // Validate the CSRF token to protect against CSRF attacks
            await _antiforgery.ValidateRequestAsync(HttpContext);

            // Sign out the user, removing the authentication cookie
            await _signInManager.SignOutAsync();

            // Delete the CSRF token cookie
            Response.Cookies.Delete("XSRF-TOKEN", new CookieOptions
            {
                HttpOnly = false,
                Secure = !_webHostEnvironment.IsDevelopment(),
                SameSite = _webHostEnvironment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
                Domain = _webHostEnvironment.IsDevelopment() ? null : ".chipilidev.com",
                Path = "/"
            });
            return Ok(new { Message = "Logout successful." });
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetUser()
        {
            // Use the email in the JWT to fetch user
            string email = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrEmpty(email)) { 
                return Unauthorized();
            }

            ApplicationUser user = _uow.User.Get(u => u.Email == email, null, "Likes");
            if (user == null)
            {
                return StatusCode(404);
            }
            return Ok(new UserResponseDto { DisplayName = user.DisplayName, FirstName = user.FirstName, LastName = user.LastName, Likes = user.Likes });
        }

        [HttpPatch]
        [Authorize]
        public IActionResult UpdateUser([FromBody] UserUpdateDto userUpdateDto)
        {
            _antiforgery.ValidateRequestAsync(HttpContext).Wait();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string email = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrEmpty(email)) 
            {
                return Unauthorized();
            }

            var user = _uow.User.Get(u => u.Email == email);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            UserUpdateModel model = new() { Email = email, DisplayName = userUpdateDto.DisplayName, FirstName = userUpdateDto.FirstName, LastName = userUpdateDto.LastName };
            _uow.User.Update(model);

            _uow.Save();
            return Ok(new { Message = "User updated successfully" });


        }
    }
}
