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

        public T Get(Expression<Func<T, bool>> filter, Expression<Func<T, object>>? orderBy = null, string? includeProperties = "")
        {
            IQueryable<T> query = dbSet;
            query = query.Where(filter);

            if (orderBy != null) 
            { 
                query = query.OrderBy(orderBy);
            }

            if (!string.IsNullOrWhiteSpace(includeProperties)) 
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp.Trim());
                }
            }

            return query.FirstOrDefault();
        }

        public IEnumerable<T> GetAll(Expression<Func<T, bool>>? filter = null, Expression<Func<T, object>> orderBy = null, string includeProperties = "")
        {
            IQueryable<T> query = dbSet;
            // Apply filter if provided
            if (filter != null)
            {
                query = query.Where(filter);
            }

            // Split comma-separated list of navigation properties
            if (!string.IsNullOrWhiteSpace(includeProperties)) 
            { 
                // Include them one by one
                foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp.Trim());
                }
            }

            if (orderBy != null)
            {
                query = query.OrderBy(orderBy);
            }

            return [.. query];
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
