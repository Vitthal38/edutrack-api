using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduTrackAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddEnrolledAtToEnrollments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EnrolledAt",
                table: "Enrollments",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnrolledAt",
                table: "Enrollments");
        }
    }
}
