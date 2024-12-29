using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataAccess.Dtos;
using WebApi.DataAccess.Repository;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class LikeController : BaseController
    {
        UnitOfWork _uow;
        public LikeController(UnitOfWork unitOfWork)
        {
            _uow = unitOfWork;
        }

        private (Property? property, ApplicationUser? user, PropertyLike? propertyLike) GetLikeContext(int propertyId)
        {
            Property property = _uow.Property.Get(p => p.Id == propertyId);
            if (property == null)
            {
                return (null, null, null);
            }

            string email = GetEmailFromClaims();
            ApplicationUser user = _uow.User.Get(u => u.Email == email);

            if (user == null)
            {
                return (property, null, null);
            }

            PropertyLike propertyLike = _uow.PropertyLike.Get(pl=>pl.PropertyId == propertyId && pl.UserId == user.Id);
            
            return (property, user,  propertyLike);


        }

        [HttpGet("/{id}")]
        [Authorize]
        public IActionResult GetLikes(int id) 
        {
           PropertyLike propertyLike = _uow.PropertyLike.Get(pl => pl.Id == id);
            if (propertyLike == null) 
            { 
                return NotFound();
            }
            return Ok(propertyLike);
        }
        // Like property
        [HttpPost]
        [Authorize]
        public IActionResult LikeProperty(PropertyLikeDto propertyLikeDto) 
        {
            var (property, user, propertyLike) = GetLikeContext(propertyLikeDto.PropertyId);
            if (property == null || user == null)
            {
                return NotFound();
            }
            if (propertyLike != null)
            {
                return StatusCode(403);
            }
            PropertyLike newPropertyLike = new() { PropertyId = propertyLikeDto.PropertyId, UserId = user.Id };
            
            _uow.PropertyLike.Add(newPropertyLike);
            // Increase Like counter here
            
            _uow.Save();
            return StatusCode(201);
            
        }

        // Unlike property
        [HttpDelete]
        [Authorize]
        public IActionResult UnlikeProperty(PropertyLikeDto propertyLikeDto)
        {

            var (property, user, propertyLike) = GetLikeContext(propertyLikeDto.PropertyId);
            if (property == null || user == null)
            {
                return NotFound();
            }
            if (propertyLike == null)
            {
                return StatusCode(403);
            }

            _uow.PropertyLike.Remove(propertyLike);
            // Increase Like counter here

            _uow.Save();
            return StatusCode(204);

        }
    }
}
