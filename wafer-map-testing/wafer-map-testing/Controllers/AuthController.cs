using Microsoft.AspNetCore.Mvc;
using wafer_map_testing.Models;
using wafer_map_testing.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
  private readonly IAuthService _authService;

  public AuthController(IAuthService authService)
  {
    _authService = authService;
  }

  [HttpPost("login")]
  public IActionResult Login([FromBody] LoginModel loginModel)
  {
    var user = _authService.Authenticate(loginModel.Username, loginModel.Password);
    if (user == null)
    {
      return Unauthorized();
    }

    return Ok();
  }
}
