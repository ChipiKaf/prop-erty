using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.DataAccess.Data;
using WebApi.DataAccess.Interfaces;
using WebApi.Models;

namespace WebApi.DataAccess.Repository
{
    public class PropertyLikeRepository : Repository<PropertyLike>, IPropertyLikeRepository
    {
        public PropertyLikeRepository(ApplicationContext db) : base(db)
        {
        }
    }
}
