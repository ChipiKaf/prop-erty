using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.DataAccess.Dtos;
using WebApi.Models;

namespace WebApi.DataAccess.Interfaces
{
    public interface IUserRepository : IRepository<ApplicationUser>
    {
        void Update(UserUpdateModel obj);
    }
}
