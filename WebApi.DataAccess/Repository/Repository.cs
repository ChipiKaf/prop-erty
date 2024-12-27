using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApi.DataAccess.Data;
using WebApi.DataAccess.Interfaces;

namespace WebApi.DataAccess.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ApplicationContext _db;
        internal DbSet<T> dbSet;
        public Repository(ApplicationContext db)
        {
            _db = db;
            this.dbSet = _db.Set<T>();
        }
        public void Add(T entity)
        {
            dbSet.Add(entity);
        }

        public T Get(Expression<Func<T, bool>> filter, Expression<Func<T, object>> orderBy = null)
        {
            IQueryable<T> query = dbSet;
            query = query.Where(filter);

            if (orderBy != null) 
            { 
                query = query.OrderBy(orderBy);
            }

            return query.FirstOrDefault();
        }

        public IEnumerable<T> GetAll()
        {
            IQueryable<T> query = dbSet;
            return query.ToList();
        }

        public void Remove(T entity)
        {
            dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entity)
        {
            dbSet.RemoveRange(entity);
        }
    }
}
