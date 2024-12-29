using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected int GetUserId() {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        protected string GetEmailFromClaims()
        {
            var emailClaim = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            return emailClaim == null ? throw new UnauthorizedAccessException("Invalid token: Email claim missing.") : emailClaim.Value;
        }
    }
}