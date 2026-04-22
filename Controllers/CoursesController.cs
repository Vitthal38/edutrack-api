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
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoursesController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/courses — any logged-in user can view
        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Enrollments)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Duration,
                    c.Category,
                    c.Seats,
                    EnrolledCount = c.Enrollments.Count
                })
                .ToListAsync();

            return Ok(courses);
        }

        // POST /api/courses — only Admins
[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> AddCourse([FromBody] Course course)
{
    _context.Courses.Add(course);
    await _context.SaveChangesAsync();
    return Ok(new
    {
        id = course.Id,
        name = course.Name,
        category = course.Category,
        duration = course.Duration,
        seats = course.Seats,
        enrolledCount = 0
    });
}

        // DELETE /api/courses/{id} — only Admins
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            // Also remove related enrollments
            var enrollments = _context.Enrollments.Where(e => e.CourseId == id);
            _context.Enrollments.RemoveRange(enrollments);

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}