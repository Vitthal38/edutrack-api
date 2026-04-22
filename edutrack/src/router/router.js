import { routes, publicRoutes } from './routes.js';
import { auth } from '../lib/auth.js';

export function initRouter(rootEl) {
  const render = () => {
    const path = location.pathname;

    // Auth guard: redirect to /login if not authenticated
    if (!auth.isAuthenticated() && !publicRoutes.includes(path)) {
      history.replaceState({}, '', '/login');
      return render();
    }

    // Already logged in? skip auth pages
    if (auth.isAuthenticated() && publicRoutes.includes(path)) {
      history.replaceState({}, '', '/');
      return render();
    }

    renderNavbar();
    const mount = routes[path] ?? notFound;
    mount(rootEl);
    updateActiveLink(path);
  };

  window.addEventListener('popstate', render);

  document.body.addEventListener('click', (e) => {
    // Handle logout button
    if (e.target.closest('[data-logout]')) {
      e.preventDefault();
      auth.logout();
      window.location.href = '/login';
      return;
    }

    // Handle internal navigation links
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href && href !== location.pathname) {
      history.pushState({}, '', href);
      render();
    }
  });

  render();
}

function renderNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const isLoggedIn = auth.isAuthenticated();
  const user = auth.getUser();

  if (!isLoggedIn) {
    nav.innerHTML = `<a href="/login" class="navbar-brand" data-link>EduTrack</a>`;
    return;
  }

  nav.innerHTML = `
    <a href="/" class="navbar-brand" data-link>EduTrack</a>
    <a href="/" class="navbar-link" data-link>Dashboard</a>
    <a href="/students" class="navbar-link" data-link>Students</a>
    <a href="/courses" class="navbar-link" data-link>Courses</a>
    <a href="/enrollments" class="navbar-link" data-link>Enrollments</a>
    <div class="navbar-spacer"></div>
    <span class="navbar-user">
      ${escapeHtml(user.name)}
      <span class="navbar-role">${user.role}</span>
    </span>
    <a href="#" class="navbar-link" data-logout>Logout</a>
  `;
}

function updateActiveLink(path) {
  document.querySelectorAll('.navbar-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path);
  });
}

function notFound(root) {
  root.innerHTML = `
    <section class="page">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/" data-link>Go home</a>
    </section>
  `;
}

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}