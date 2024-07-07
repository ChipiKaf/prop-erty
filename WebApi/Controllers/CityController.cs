using Microsoft.AspNetCore.Mvc;
using WebApi.Data.Repo;
using WebApi.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CityController(ICityRepository repo) : ControllerBase
    {
        public ICityRepository Repo { get; } = repo;

        [HttpGet("")]
        public async Task<IActionResult> GetCities()
        {
            var cities = await Repo.GetCitiesAsync();
            return Ok(cities);
        }
        
        [HttpPost("post")]
        public async Task<IActionResult> AddCity(City city)
        {

            Repo.AddCity(city);
            await Repo.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCityModelById(int id)
        {
            Repo.DeleteCity(id);

            await Repo.SaveAsync();

            return Ok(id);
        }       
    }
}