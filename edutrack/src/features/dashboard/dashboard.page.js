import { studentApi } from '../../api/studentApi.js';
import { courseApi } from '../../api/courseApi.js';
import { enrollmentApi } from '../../api/enrollmentApi.js';
import {
  renderDashboard,
  renderDashboardLoading,
  renderDashboardError,
} from './dashboard.view.js';

export async function mountDashboardPage(root) {
  renderDashboardLoading(root);

  try {
    const [students, courses, enrollments] = await Promise.all([
      studentApi.list(),
      courseApi.list(),
      enrollmentApi.list(),
    ]);
    renderDashboard(root, { students, courses, enrollments });
  } catch (err) {
    renderDashboardError(root, err.message);
    root.querySelector('#retry-dashboard')
        ?.addEventListener('click', () => mountDashboardPage(root));
  }
}