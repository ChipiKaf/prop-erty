using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.DataAccess.Data;
using WebApi.DataAccess.Dtos;
using WebApi.DataAccess.Interfaces;
using WebApi.Models;

namespace WebApi.DataAccess.Repository
{
    public class UserRespository : Repository<ApplicationUser>, IUserRepository
    {
        ApplicationContext _db;
        public UserRespository(ApplicationContext db): base(db)
        {
            _db = db;
        }
        public void Update(UserUpdateModel obj)
        {
            ApplicationUser userToUpdate = base.Get(u=>u.Email == obj.Email);
            if (userToUpdate != null) 
            {
                userToUpdate.DisplayName = obj.DisplayName;
                userToUpdate.FirstName = obj.FirstName;
                userToUpdate.LastName = obj.LastName;
            }
        }
    }
}
