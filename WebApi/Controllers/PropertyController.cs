using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataAccess.Interfaces;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class PropertyController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public PropertyController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet("properties")]
        [AllowAnonymous]
        public IActionResult GetProperties()
        {
            IEnumerable<Property> properties = _unitOfWork.Property.GetAll();
            return Ok(properties);
        }

    }
}
