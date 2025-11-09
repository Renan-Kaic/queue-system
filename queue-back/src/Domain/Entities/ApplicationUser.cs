using Microsoft.AspNetCore.Identity;

namespace cronly_back.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; } = string.Empty;
    public string? GivenName { get; set; }  = string.Empty;
    public string? Surname { get; set; }  = string.Empty;
    public string? ProfilePictureUrl { get; set; }  = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public ICollection<ApplicationUserRole> UserRoles { get; set; } = [];
    public ICollection<ApplicationUserRole> RolesPromoted { get; set; } = [];
    public ICollection<ApplicationUserRole> RolesRemoved { get; set; } = [];


}