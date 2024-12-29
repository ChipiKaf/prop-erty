using System.Text.Json.Serialization;

namespace WebApi.Models
{
    public class Property : BaseEntity
    {
        public string Name { get; set; }
        public string City { get; set; }
        public string Image { get; set; }

        public string Type { get; set; }
        public string Description { get; set; }
        public string Model { get; set; }
        public string Texture { get; set; }

        public float Cost { get; set; }
        public int Likes => PropertyLikeCount != null ? PropertyLikeCount.Count : 0;

        [JsonIgnore]
        public PropertyLikeCount PropertyLikeCount { get; set; }
    }
}
