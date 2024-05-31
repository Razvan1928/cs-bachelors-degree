using wafer_map_testing.Models;

namespace wafer_map_testing.Services
{
  public interface IAuthService
  {
    User Authenticate(string username, string password);
  }
}
