using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class PropertyLike : BaseEntity
    {
        public int PropertyId { get; set; }
        public string UserId {  get; set; }
        public ApplicationUser User { get; set; }
        public Property Property { get; set; } // Navigation Property to link foreign key
    }
}
