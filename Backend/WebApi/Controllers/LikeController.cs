using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataAccess.Dtos;
using WebApi.DataAccess.Interfaces;
using WebApi.DataAccess.Repository;
using WebApi.Models;
using WebApi.Services;

namespace WebApi.Controllers
{
    public class LikeController : BaseController
    {
        private readonly IUnitOfWork _uow;
        private readonly SqsService _sqsService;
        public LikeController(IUnitOfWork unitOfWork, SqsService sqsService)
        {
            _uow = unitOfWork;
            _sqsService = sqsService;
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
        private async Task<IActionResult> ProcessLikeAction(PropertyLikeDto propertyLikeDto, string action, int successStatusCode) 
        {
            var (property, user, propertyLike) = GetLikeContext(propertyLikeDto.PropertyId);
            if (property == null || user == null)
            {
                return NotFound();
            }
            SQSMessageDto message = new()
            {
                Action = action,
                PropertyId = propertyLikeDto.PropertyId,
                UserId = user.Id,
                Timestamp = DateTime.UtcNow,
            };

            await _sqsService.SendMessageAsync(message, $"${user.Id}_${propertyLikeDto.PropertyId}");

            return StatusCode(successStatusCode);

        }
        // Like property
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> LikeProperty(PropertyLikeDto propertyLikeDto) 
        {
            return await ProcessLikeAction(propertyLikeDto, "Like", 201);
        }

        // Unlike property
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> UnlikeProperty(PropertyLikeDto propertyLikeDto)
        {

            return await ProcessLikeAction(propertyLikeDto, "Unlike", 200);

        }
    }
}
