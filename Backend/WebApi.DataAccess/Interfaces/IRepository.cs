using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.DataAccess.Interfaces
{
    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetAll(Expression<Func<T, bool>>? filter = null, Expression<Func<T, object>> orderBy = null, string includeProperties = "");
        T Get(Expression<Func<T, bool>> filter, Expression<Func<T, object>> orderBy = null, string includeProperties = "");
        void Add(T entity);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entity);
    }
}
