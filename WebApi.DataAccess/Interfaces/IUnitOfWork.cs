using System.Threading.Tasks;

namespace WebApi.DataAccess.Interfaces
{
    public interface IUnitOfWork
    {
        IPropertyRepository Property { get; }

        void Save();

         //Task<bool> SaveAsync();
    }
}