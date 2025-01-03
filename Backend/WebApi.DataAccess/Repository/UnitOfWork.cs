﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.DataAccess.Data;
using WebApi.DataAccess.Interfaces;

namespace WebApi.DataAccess.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private ApplicationContext _db;
        public IPropertyRepository Property { get; private set; }

        public IUserRepository User { get; private set; }

        public IPropertyLikeRepository PropertyLike { get; private set; }

        public UnitOfWork(ApplicationContext db)
        {
            _db = db;
            Property = new PropertyRepository(_db);
            User = new UserRespository(_db);
            PropertyLike = new PropertyLikeRepository(_db);
        }

        public void Save()
        {
            _db.SaveChanges();
        }
    }
}
