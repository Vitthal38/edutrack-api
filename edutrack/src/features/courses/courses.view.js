export function renderCoursesView(container, courses) {
  container.innerHTML = `
    <section class="page">
      <h1>Courses</h1>

      <form id="course-form" class="course-form">
        <input name="name"     placeholder="Course name" required />
        <input name="category" placeholder="Category (e.g. Backend)" />
        <input name="duration" placeholder="Duration (e.g. 6 weeks)" />
        <input name="seats"    type="number" min="1" max="500" value="30" placeholder="Seats" />
        <button type="submit">Add course</button>
        <p class="form-error" hidden></p>
      </form>

      <div id="course-list-slot">
        ${renderList(courses)}
      </div>
    </section>
  `;
}

export function renderCourseList(container, courses) {
  container.innerHTML = renderList(courses);
}

function renderList(courses) {
  if (!courses.length) {
    return '<p class="empty">No courses yet. Add one above.</p>';
  }
  return `
    <ul class="course-list">
      ${courses.map(c => {
        const enrolled = c.enrolledCount ?? 0;
        const seats = c.seats ?? 0;
        const isFull = seats > 0 && enrolled >= seats;
        return `
          <li class="course-card" data-id="${c.id}">
            <div class="course-card-body">
              <h3>${escapeHtml(c.name)}</h3>
              <p class="course-meta">
                ${escapeHtml(c.category ?? 'Uncategorized')} · ${escapeHtml(c.duration ?? 'Flexible')}
              </p>
              <p class="course-seats ${isFull ? 'is-full' : ''}">
                ${enrolled} / ${seats} enrolled ${isFull ? '(full)' : ''}
              </p>
            </div>
            <button data-action="delete" data-id="${c.id}" class="btn-danger">
              Delete
            </button>
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}