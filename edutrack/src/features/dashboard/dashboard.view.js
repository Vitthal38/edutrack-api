export function renderDashboard(container, { students, courses, enrollments }) {
  container.innerHTML = `
    <section class="page dashboard">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        ${statCard('Students', students.length, '/students')}
        ${statCard('Courses', courses.length, '/courses')}
        ${statCard('Enrollments', enrollments.length, '/enrollments')}
      </div>

      <div class="dashboard-columns">
        <div class="dashboard-col">
          <h2>Recent students</h2>
          ${recentList(students.slice(-5).reverse(), s => s.name)}
        </div>
        <div class="dashboard-col">
          <h2>Recent courses</h2>
          ${recentList(courses.slice(-5).reverse(), c => `${c.name} (${c.enrolledCount}/${c.seats})`)}
        </div>
      </div>
    </section>
  `;
}

export function renderDashboardLoading(container) {
  container.innerHTML = `
    <section class="page dashboard">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <div class="stat-card skeleton"></div>
        <div class="stat-card skeleton"></div>
        <div class="stat-card skeleton"></div>
      </div>
    </section>
  `;
}

export function renderDashboardError(container, message) {
  container.innerHTML = `
    <section class="page dashboard">
      <h1>Dashboard</h1>
      <p class="error">Failed to load dashboard: ${escapeHtml(message)}</p>
      <button id="retry-dashboard">Retry</button>
    </section>
  `;
}

function statCard(label, value, href) {
  return `
    <a class="stat-card" href="${href}" data-link>
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
    </a>
  `;
}

function recentList(items, formatter) {
  if (!items.length) return '<p class="empty">Nothing yet.</p>';
  return `<ul class="recent-list">${
    items.map(i => `<li>${escapeHtml(formatter(i))}</li>`).join('')
  }</ul>`;
}

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}