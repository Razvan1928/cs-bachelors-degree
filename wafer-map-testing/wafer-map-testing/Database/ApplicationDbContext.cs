using Microsoft.EntityFrameworkCore;
using wafer_map_testing.Models;

public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
      : base(options)
  {
  }

  public DbSet<User> Users { get; set; }
  public DbSet<Wafer> Wafers { get; set; }
  public DbSet<WaferMapDie> WaferMapDies { get; set; }
}
