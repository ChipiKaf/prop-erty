using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.DataAccess.Dtos
{
    public class UserUpdateDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
    }

    public class UserUpdateModel
    {
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

    }
}
