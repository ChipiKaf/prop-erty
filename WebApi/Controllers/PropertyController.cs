using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataAccess.Interfaces;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class PropertyController : BaseController
    {
        private readonly IPropertyRepository _propertyRepo;

        public PropertyController(IPropertyRepository db)
        {
            _propertyRepo = db;
        }
        [HttpGet("properties")]
        [AllowAnonymous]
        public IActionResult GetProperties()
        {
            IEnumerable<Property> properties = _propertyRepo.GetAll();
            return Ok(properties);
        }

    }
}
