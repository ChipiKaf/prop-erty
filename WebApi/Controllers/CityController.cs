using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CityController : ControllerBase
    {
        [HttpGet("")]
        public ActionResult<IEnumerable<string>> Getstring()
        {
            return new string[] {"Atlanta", "New York"};
        }
        
    }
}