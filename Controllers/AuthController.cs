using EduTrackAPI.Data;
using EduTrackAPI.DTOs;
using EduTrackAPI.Models;
using EduTrackAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduTrackAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == req.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        var user = new User
        {
            Email = req.Email,
            Name = req.Name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(
            token,
            new UserResponse(user.Id, user.Email, user.Name, user.Role)
        ));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(
            token,
            new UserResponse(user.Id, user.Email, user.Name, user.Role)
        ));
    }
}