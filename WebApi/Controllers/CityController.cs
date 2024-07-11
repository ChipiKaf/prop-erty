using Microsoft.AspNetCore.Mvc;
using WebApi.Data.Repo;
using WebApi.Models;
using WebApi.Interfaces;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CityController : ControllerBase
    {
        private readonly IUnitOfWork uow;

        public CityController(IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetCities()
        {
            var cities = await uow.CityRepository.GetCitiesAsync();
            return Ok(cities);
        }
        
        [HttpPost("post")]
        public async Task<IActionResult> AddCity(City city)
        {

            uow.CityRepository.AddCity(city);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCityModelById(int id)
        {
            uow.CityRepository.DeleteCity(id);

            await uow.SaveAsync();

            return Ok(id);
        }       
    }
}