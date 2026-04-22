using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduTrackAPI.Data;
using EduTrackAPI.Models;

namespace EduTrackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]   // requires login for all endpoints below
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/students — any logged-in user can view
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.ToListAsync();
        }

        // POST /api/students — only Admins can add
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Student>> AddStudent([FromBody] Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return Ok(student);
        }

        // DELETE /api/students/{id} — only Admins can delete
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            // Also remove related enrollments
            var enrollments = _context.Enrollments.Where(e => e.StudentId == id);
            _context.Enrollments.RemoveRange(enrollments);

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}