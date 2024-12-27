using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.Models;

namespace WebApi.DataAccess.Interfaces
{
    public interface IPropertyRepository: IRepository<Property>
    {
        void Update(Property obj);
    }
}
