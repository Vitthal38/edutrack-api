export function renderStudents(container, students) {
  if (!students || students.length === 0) {
    container.innerHTML = "<p>No students found</p>";
    return;
  }

  container.innerHTML = `
    <ul>
      ${students.map(s => `
        <li>
          <strong>${s.name}</strong> (${s.email}) - Age: ${s.age}
        </li>
      `).join('')}
    </ul>
  `;
}