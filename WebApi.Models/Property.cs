using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models
{
    public class Property: BaseEntity
    {
        public string Name { get; set; }
        public string City {  get; set; }
        public string Image {  get; set; }

        public string Type {  get; set; }
        public string Description { get; set; }
        public string model { get; set; }
        public string texture { get; set; }

        public float Cost { get; set; }
    }
}
