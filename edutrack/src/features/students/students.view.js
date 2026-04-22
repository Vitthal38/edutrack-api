export function renderStudentsView(container, students) {
  container.innerHTML = `
    <section class="page">
      <h1>Students</h1>

      <form id="student-form" class="student-form">
        <input name="name"  placeholder="Full name" required />
        <input name="email" placeholder="Email" type="email" required />
        <input name="age"   placeholder="Age" type="number" min="1" max="120" />
        <input name="course" placeholder="Course (optional)" />
        <button type="submit">Add student</button>
        <p class="form-error" hidden></p>
      </form>

      <div id="student-list-slot">
        ${renderList(students)}
      </div>
    </section>
  `;
}

export function renderStudentList(container, students) {
  container.innerHTML = renderList(students);
}

function renderList(students) {
  if (!students.length) {
    return '<p class="empty">No students yet. Add one above.</p>';
  }
  return `
    <table class="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Course</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${students.map(s => `
          <tr data-id="${s.id}">
            <td>${escapeHtml(s.name)}</td>
            <td>${escapeHtml(s.email)}</td>
            <td>${s.age ?? '—'}</td>
            <td>${escapeHtml(s.course ?? '—')}</td>
            <td>
              <button data-action="delete" data-id="${s.id}" class="btn-danger">
                Delete
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}