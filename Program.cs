using System.Text;
using EduTrackAPI.Data;
using EduTrackAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Render provides PORT env var; default to 5097 locally
var port = Environment.GetEnvironmentVariable("PORT") ?? "5097";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ============================================
// SERVICES
// ============================================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = 
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Database — read connection string from config (env var in prod)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=edutrack.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Register custom services
builder.Services.AddScoped<TokenService>();

// CORS — different policies for dev vs prod
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });

    options.AddPolicy("prod", policy =>
    {
        var origins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")
            ?.Split(',', StringSplitOptions.RemoveEmptyEntries)
            ?? new[] { "http://localhost:5173" };

        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Authentication — read key from env var first, fallback to appsettings
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
    ?? jwtSettings["Key"]
    ?? throw new InvalidOperationException("JWT Key is not configured");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ============================================
// MIDDLEWARE
// ============================================

app.UseCors(app.Environment.IsDevelopment() ? "dev" : "prod");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ============================================
// SEED ADMIN USER
// ============================================

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        db.Users.Add(new EduTrackAPI.Models.User
        {
            Email = "admin@edutrack.com",
            Name = "Admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow
        });
        db.SaveChanges();
    }
}

app.Run();