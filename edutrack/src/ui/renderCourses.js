export function renderCourses(container, courses) {
  if (!courses || courses.length === 0) {
    container.innerHTML = "<p>No courses found</p>";
    return;
  }

  container.innerHTML = `
    <ul>
      ${courses.map(c => `
        <li>
          <strong>${c.title}</strong> - ${c.duration}
        </li>
      `).join('')}
    </ul>
  `;
}