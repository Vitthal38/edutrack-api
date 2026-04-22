import { authApi } from '../../api/authApi.js';
import { auth } from '../../lib/auth.js';
import { ApiError } from '../../lib/http.js';
import { toast } from '../../lib/toast.js';

export function mountRegisterPage(root) {
  root.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Create account</h1>
        <p class="auth-subtitle">Sign up for EduTrack</p>

        <form id="register-form" class="auth-form">
          <input name="name" placeholder="Full name" required autofocus />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password (min 6 chars)" minlength="6" required />
          <button type="submit">Create account</button>
          <p class="form-error" hidden></p>
        </form>

        <p class="auth-footer">
          Already have an account? <a href="/login" data-link>Sign in</a>
        </p>
      </div>
    </section>
  `;

  const form = root.querySelector('#register-form');
  const errorEl = form.querySelector('.form-error');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const fd = new FormData(form);
    const dto = {
      name: fd.get('name').trim(),
      email: fd.get('email').trim(),
      password: fd.get('password'),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating…';

    try {
      const { token, user } = await authApi.register(dto);
      auth.login(token, user);
      toast.success(`Welcome, ${user.name}`);
      window.location.href = '/';
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed';
      errorEl.textContent = msg;
      errorEl.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create account';
    }
  });
}