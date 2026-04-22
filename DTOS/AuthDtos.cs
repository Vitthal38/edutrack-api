using System.ComponentModel.DataAnnotations;

namespace EduTrackAPI.DTOs;

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    [Required, MaxLength(100)] string Name
);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record AuthResponse(
    string Token,
    UserResponse User
);

public record UserResponse(
    int Id,
    string Email,
    string Name,
    string Role
);