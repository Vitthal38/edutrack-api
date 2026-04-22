using System.ComponentModel.DataAnnotations;

namespace EduTrackAPI.Models;

public class User
{
    public int Id { get; set; }

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "User"; // "User" or "Admin"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}