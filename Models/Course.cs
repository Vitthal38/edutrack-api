namespace EduTrackAPI.Models;

public class Course
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Duration { get; set; }
    public string? Category { get; set; }
    public int Seats { get; set; } = 30;
    public List<Enrollment> Enrollments { get; set; } = new();
}