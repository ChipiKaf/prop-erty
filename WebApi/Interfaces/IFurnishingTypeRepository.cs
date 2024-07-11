using System.Collections.Generic;
using System.Threading.Tasks;
using WebApi.Models;

namespace WebApi.Interfaces
{
    public interface IFurnishingTypeRepository
    {
         Task<IEnumerable<FurnishingType>> GetFurnishingTypesAsync();
    }
}