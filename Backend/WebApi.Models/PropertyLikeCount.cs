using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class PropertyLikeCount : BaseEntity
    {
        public int Id { get; set; }
        public int Count { get; set; }
        public Property Property { get; set; }
    }
}
