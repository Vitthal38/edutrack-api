import { courseApi } from '../../api/courseApi.js';
import { ApiError } from '../../lib/http.js';
import { toast } from '../../lib/toast.js';
import { showLoading, showError } from '../../lib/loading.js';
import { renderCoursesView, renderCourseList } from './courses.view.js';

export async function mountCoursesPage(root) {
  showLoading(root, 'Loading courses…');

  let courses;
  try {
    courses = await courseApi.list();
  } catch (err) {
    showError(root, err.message, () => mountCoursesPage(root));
    return;
  }

  renderCoursesView(root, courses);

  const formEl = root.querySelector('#course-form');
  const listSlot = root.querySelector('#course-list-slot');

  // Form submission
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = formEl.querySelector('.form-error');
    const submitBtn = formEl.querySelector('button[type="submit"]');
    errorEl.hidden = true;

    const fd = new FormData(formEl);
    const dto = {
      name:     fd.get('name')?.trim(),
      category: fd.get('category')?.trim() || null,
      duration: fd.get('duration')?.trim() || null,
      seats:    Number(fd.get('seats')) || 30,
    };

    // Simple validation
    if (!dto.name) {
      errorEl.textContent = 'Course name is required';
      errorEl.hidden = false;
      return;
    }
    if (dto.seats < 1 || dto.seats > 500) {
      errorEl.textContent = 'Seats must be between 1 and 500';
      errorEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding…';

    try {
      await courseApi.create(dto);
      formEl.reset();
      const fresh = await courseApi.list();
      renderCourseList(listSlot, fresh);
      toast.success(`Added "${dto.name}"`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to add course';
      errorEl.textContent = msg;
      errorEl.hidden = false;
      toast.error(msg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add course';
    }
  });

  // Delete handler (event delegation)
  listSlot.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="delete"]');
    if (!btn) return;
    if (!confirm('Delete this course? Enrollments for it will also be removed.')) return;

    const id = Number(btn.dataset.id);
    try {
      await courseApi.remove(id);
      const fresh = await courseApi.list();
      renderCourseList(listSlot, fresh);
      toast.success('Course deleted');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Delete failed';
      toast.error(msg);
    }
  });
}