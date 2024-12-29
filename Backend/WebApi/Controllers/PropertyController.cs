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
        [Authorize]
        [HttpGet("properties")]
        public IActionResult GetProperties()
        {
            IEnumerable<Property> properties = _unitOfWork.Property.GetAll(
                filter: null,
                orderBy: p=>p.Id,
                includeProperties: "PropertyLikeCount"
                );
            return Ok(properties);
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult GetProperty(int id)
        {
            Property currentItem = _unitOfWork.Property.Get(u => u.Id == id);

            if (currentItem == null)
            {
                return BadRequest("Property not found");
            }

            Property nextItem = _unitOfWork.Property.Get(u => u.Id > id, orderBy: u => u.Id);

            Property prevItem = _unitOfWork.Property.Get(u => u.Id < id, orderBy: u => u.Id);

            return Ok(new { prevItem, currentItem, nextItem });
        }

    }
}
