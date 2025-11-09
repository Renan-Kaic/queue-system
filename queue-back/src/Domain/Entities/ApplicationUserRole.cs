using cronly_back.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace cronly_back.Domain.Entities;

public class ApplicationUserRole : IdentityUserRole<string>
{
    public string PromotedBy { get; set; } = string.Empty;
    public string? RemovedBy { get; set; } = string.Empty;
    public RoleStatus RoleStatus { get; set; } = RoleStatus.Active;
    public DateTime AssignedAt { get; set; } = DateTime.Now;
    public DateTime? RemovedAt { get; set; }
    
    public ApplicationUser? User { get; set; }
    public ApplicationUser? PromotedByUser { get; set; }
    public ApplicationUser? RemovedByUser { get; set; }
   
    }