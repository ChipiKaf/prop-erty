using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.DataAccess.Dtos
{
    public class SQSMessageDto
    {

        public required string Action { get; set; }
        public required int PropertyId { get; set; }
        public required string UserId { get; set; }
        public required DateTime Timestamp { get; set; }
    }
}
