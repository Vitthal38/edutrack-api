using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduTrackAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Courses",
                newName: "Duration");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Courses",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Seats",
                table: "Courses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Seats",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Courses",
                newName: "Description");
        }
    }
}
