let container;

function ensureContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

function show(message, variant = 'info', duration = 3000) {
  const root = ensureContainer();
  const el = document.createElement('div');
  el.className = `toast toast-${variant}`;
  el.textContent = message;
  root.appendChild(el);

  requestAnimationFrame(() => el.classList.add('toast-visible'));

  setTimeout(() => {
    el.classList.remove('toast-visible');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    // fallback in case transition doesn't fire
    setTimeout(() => el.remove(), 500);
  }, duration);
}

export const toast = {
  success: (m) => show(m, 'success'),
  error:   (m) => show(m, 'error', 5000),
  info:    (m) => show(m, 'info'),
};