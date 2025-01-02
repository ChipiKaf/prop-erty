using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class PropertyLike : BaseEntity
    {
        // @Todo: See how the BaseEntity stuff will be included in all Model Types
        public int PropertyId { get; set; }
        public string UserId {  get; set; }
        [JsonIgnore]
        public ApplicationUser User { get; set; }
        [JsonIgnore]
        public Property Property { get; set; } // Navigation Property to link foreign key
    }
}
