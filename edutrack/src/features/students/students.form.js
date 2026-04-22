import { studentApi } from '../../api/studentApi.js';
import { ApiError } from '../../lib/http.js';
import { validate, validators as v } from '../../lib/validation.js';

export function setupStudentForm(formEl, { onSuccess, onError } = {}) {
  if (!formEl) return;

  const errorEl = formEl.querySelector('.form-error');
  const submitBtn = formEl.querySelector('button[type="submit"]');

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const fd = new FormData(formEl);
    const dto = {
      name:   fd.get('name')?.trim(),
      email:  fd.get('email')?.trim(),
      age:    fd.get('age') ? Number(fd.get('age')) : null,
      course: fd.get('course')?.trim() || null,
    };

    // Client-side validation
    const { valid, errors } = validate(dto, {
      name:  [v.required, v.maxLength(100)],
      email: [v.required, v.email],
      age:   [v.min(1), v.max(120)],
    });

    if (!valid) {
      const firstError = Object.values(errors)[0];
      showError(firstError);
      return;
    }

    setLoading(true);
    try {
      const created = await studentApi.create(dto);
      formEl.reset();
      onSuccess?.(created);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to add student';
      showError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  });

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Adding…' : 'Add student';
  }
}