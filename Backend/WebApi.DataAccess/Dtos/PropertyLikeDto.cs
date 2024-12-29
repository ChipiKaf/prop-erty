using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.DataAccess.Dtos
{
    public class PropertyLikeDto
    {
        [Required]
        public int PropertyId { get; set; }
    }
}
