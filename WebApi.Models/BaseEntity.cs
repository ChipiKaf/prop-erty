using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models
{
    public class BaseEntity
    {
        [Column(Order = 0)]
        public int Id { get; set; }

        // Use UTC to align with PostgreSQL's timestamp with time zone
        [Column(TypeName = "timestamp with time zone")]
        public DateTime LastUpdatedOn { get; set; } = DateTime.UtcNow;

        public int LastUpdatedBy { get; set; }
    }
}
