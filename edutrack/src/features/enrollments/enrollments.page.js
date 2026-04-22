import { studentApi } from '../../api/studentApi.js';
import { courseApi } from '../../api/courseApi.js';
import { enrollmentApi } from '../../api/enrollmentApi.js';
import { ApiError } from '../../lib/http.js';
import { toast } from '../../lib/toast.js';
import { showLoading, showError } from '../../lib/loading.js';
import { renderEnrollmentsView, renderEnrollmentList } from './enrollments.view.js';

export async function mountEnrollmentsPage(root) {
  showLoading(root, 'Loading enrollments…');

  let students, courses, enrollments;
  try {
    [students, courses, enrollments] = await Promise.all([
      studentApi.list(),
      courseApi.list(),
      enrollmentApi.list(),
    ]);
  } catch (err) {
    showError(root, err.message, () => mountEnrollmentsPage(root));
    return;
  }

  renderEnrollmentsView(root, { enrollments, students, courses });

  const formEl = root.querySelector('#enrollment-form');
  const listSlot = root.querySelector('#enrollment-list-slot');

  // Form submission
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = formEl.querySelector('.form-error');
    const submitBtn = formEl.querySelector('button[type="submit"]');
    errorEl.hidden = true;

    const fd = new FormData(formEl);
    const dto = {
      studentId: Number(fd.get('studentId')),
      courseId:  Number(fd.get('courseId')),
    };

    if (!dto.studentId || !dto.courseId) {
      errorEl.textContent = 'Please pick both a student and a course';
      errorEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enrolling…';

    try {
      await enrollmentApi.create(dto);
      formEl.reset();
      const fresh = await enrollmentApi.list();
      renderEnrollmentList(listSlot, fresh);
      toast.success('Student enrolled');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Enrollment failed';
      errorEl.textContent = msg;
      errorEl.hidden = false;
      toast.error(msg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enroll';
    }
  });

  // Delete handler
  listSlot.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="delete"]');
    if (!btn) return;
    if (!confirm('Remove this enrollment?')) return;

    const id = Number(btn.dataset.id);
    try {
      await enrollmentApi.remove(id);
      const fresh = await enrollmentApi.list();
      renderEnrollmentList(listSlot, fresh);
      toast.success('Enrollment removed');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Delete failed';
      toast.error(msg);
    }
  });
}