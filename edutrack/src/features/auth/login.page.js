import { authApi } from '../../api/authApi.js';
import { auth } from '../../lib/auth.js';
import { ApiError } from '../../lib/http.js';
import { toast } from '../../lib/toast.js';

export function mountLoginPage(root) {
  root.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Welcome back</h1>
        <p class="auth-subtitle">Sign in to your EduTrack account</p>

        <form id="login-form" class="auth-form">
          <input name="email" type="email" placeholder="Email" required autofocus />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Sign in</button>
          <p class="form-error" hidden></p>
        </form>

        <p class="auth-footer">
          Don't have an account? <a href="/register" data-link>Create one</a>
        </p>

        <div class="auth-hint">
          <strong>Demo admin:</strong> admin@edutrack.com / admin123
        </div>
      </div>
    </section>
  `;

  const form = root.querySelector('#login-form');
  const errorEl = form.querySelector('.form-error');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const fd = new FormData(form);
    const dto = {
      email: fd.get('email').trim(),
      password: fd.get('password'),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    try {
      const { token, user } = await authApi.login(dto);
      auth.login(token, user);
      toast.success(`Welcome, ${user.name}`);
      window.location.href = '/';
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login failed';
      errorEl.textContent = msg;
      errorEl.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign in';
    }
  });
}