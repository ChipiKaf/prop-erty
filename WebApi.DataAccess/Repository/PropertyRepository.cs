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
    public class PropertyRepository : Repository<Property>, IPropertyRepository
    {
        private ApplicationContext _db;
        public PropertyRepository(ApplicationContext db): base(db)
        {
            _db = db;
        }

        public void Update(Property obj)
        {
            _db.Properties.Update(obj);
        }
    }
}
