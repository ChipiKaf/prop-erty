using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.Models;

namespace WebApi.DataAccess.Dtos
{
    public class UserResponseDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DisplayName { get; set; }
        public ICollection<PropertyLike> Likes { get; set; }
    }
}
