export function renderEnrollmentsView(container, { enrollments, students, courses }) {
  container.innerHTML = `
    <section class="page">
      <h1>Enrollments</h1>

      <form id="enrollment-form" class="enrollment-form">
        <select name="studentId" required>
          <option value="">Select student…</option>
          ${students.map(s => `
            <option value="${s.id}">${escapeHtml(s.name)}</option>
          `).join('')}
        </select>

        <select name="courseId" required>
          <option value="">Select course…</option>
          ${courses.map(c => {
            const enrolled = c.enrolledCount ?? 0;
            const seats = c.seats ?? 0;
            const isFull = seats > 0 && enrolled >= seats;
            return `
              <option value="${c.id}" ${isFull ? 'disabled' : ''}>
                ${escapeHtml(c.name)} (${enrolled}/${seats})${isFull ? ' — full' : ''}
              </option>
            `;
          }).join('')}
        </select>

        <button type="submit">Enroll</button>
        <p class="form-error" hidden></p>
      </form>

      <div id="enrollment-list-slot">
        ${renderList(enrollments)}
      </div>
    </section>
  `;
}

export function renderEnrollmentList(container, enrollments) {
  container.innerHTML = renderList(enrollments);
}

function renderList(enrollments) {
  if (!enrollments.length) {
    return '<p class="empty">No enrollments yet.</p>';
  }
  return `
    <table class="enrollment-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Course</th>
          <th>Category</th>
          <th>Enrolled on</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${enrollments.map(e => `
          <tr data-id="${e.id}">
            <td>${escapeHtml(e.studentName ?? '—')}</td>
            <td>${escapeHtml(e.courseName ?? '—')}</td>
            <td>${escapeHtml(e.category ?? '—')}</td>
            <td>${formatDate(e.enrolledAt)}</td>
            <td>
              <button data-action="delete" data-id="${e.id}" class="btn-danger">
                Remove
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '—';
  }
}

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}