using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduTrackAPI.Data;
using EduTrackAPI.Models;

namespace EduTrackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EnrollmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EnrollmentsController> _logger;

        public EnrollmentsController(AppDbContext context, ILogger<EnrollmentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetEnrollments()
        {
            try
            {
                var enrollments = await _context.Enrollments
                    .Include(e => e.Student)
                    .Include(e => e.Course)
                    .ToListAsync();

                var result = enrollments.Select(e => new
                {
                    id = e.Id,
                    studentId = e.StudentId,
                    studentName = e.Student?.Name ?? "Unknown",
                    courseId = e.CourseId,
                    courseName = e.Course?.Name ?? "Unknown",
                    category = e.Course?.Category,
                    enrolledAt = e.EnrolledAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading enrollments");
                return StatusCode(500, new { message = ex.Message });
            }
        }

[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> AddEnrollment([FromBody] Enrollment enrollment)
{
    var student = await _context.Students.FindAsync(enrollment.StudentId);
    if (student == null) return BadRequest(new { message = "Student not found" });

    var course = await _context.Courses
        .Include(c => c.Enrollments)
        .FirstOrDefaultAsync(c => c.Id == enrollment.CourseId);
    if (course == null) return BadRequest(new { message = "Course not found" });

    if (course.Enrollments.Any(e => e.StudentId == enrollment.StudentId))
        return BadRequest(new { message = "Student already enrolled in this course" });

    if (course.Enrollments.Count >= course.Seats)
        return BadRequest(new { message = "Course is full" });

    enrollment.EnrolledAt = DateTime.UtcNow;
    _context.Enrollments.Add(enrollment);
    await _context.SaveChangesAsync();

    // Return a flat DTO instead of the full entity (prevents circular reference)
    return Ok(new
    {
        id = enrollment.Id,
        studentId = enrollment.StudentId,
        studentName = student.Name,
        courseId = enrollment.CourseId,
        courseName = course.Name,
        category = course.Category,
        enrolledAt = enrollment.EnrolledAt
    });
}

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEnrollment(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null) return NotFound();

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}