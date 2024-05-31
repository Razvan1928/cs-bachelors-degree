using System.Linq;
using wafer_map_testing.Models;
using wafer_map_testing.Services;

public class AuthService : IAuthService
{
  private readonly ApplicationDbContext _context;

  public AuthService(ApplicationDbContext context)
  {
    _context = context;
  }

  public User Authenticate(string username, string password)
  {
    var user = _context.Users.SingleOrDefault(u => u.Username == username && u.Password == password);
    return user;
  }
}
