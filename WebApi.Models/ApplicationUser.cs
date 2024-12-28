using System;
using Microsoft.AspNetCore.Identity;

namespace WebApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ICollection<PropertyLike> Likes { get; set; }
    }
}
