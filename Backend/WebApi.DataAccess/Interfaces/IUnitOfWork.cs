using System.Threading.Tasks;

namespace WebApi.DataAccess.Interfaces
{
    public interface IUnitOfWork
    {
        IPropertyRepository Property { get; }

        IUserRepository User { get; }

        void Save();

         //Task<bool> SaveAsync();
    }
}