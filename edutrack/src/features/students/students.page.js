import { studentApi } from '../../api/studentApi.js';
import { ApiError } from '../../lib/http.js';
import { toast } from '../../lib/toast.js';
import { showLoading, showError } from '../../lib/loading.js';
import { renderStudentsView, renderStudentList } from './students.view.js';
import { setupStudentForm } from './students.form.js';

export async function mountStudentsPage(root) {
  showLoading(root, 'Loading students…');

  let students;
  try {
    students = await studentApi.list();
  } catch (err) {
    showError(root, err.message, () => mountStudentsPage(root));
    return;
  }

  renderStudentsView(root, students);

  const formEl = root.querySelector('#student-form');
  const listSlot = root.querySelector('#student-list-slot');

  // Form submission
  setupStudentForm(formEl, {
    onSuccess: async (newStudent) => {
      toast.success(`Added ${newStudent.name}`);
      const fresh = await studentApi.list();
      renderStudentList(listSlot, fresh);
    },
    onError: (msg) => toast.error(msg),
  });

  // Delete handler (event delegation on the list)
  listSlot.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="delete"]');
    if (!btn) return;
    if (!confirm('Delete this student?')) return;

    const id = Number(btn.dataset.id);
    try {
      await studentApi.remove(id);
      const fresh = await studentApi.list();
      renderStudentList(listSlot, fresh);
      toast.success('Student deleted');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Delete failed';
      toast.error(msg);
    }
  });
}