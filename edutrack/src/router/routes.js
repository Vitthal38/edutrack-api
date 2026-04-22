import { mountDashboardPage }    from '../features/dashboard/dashboard.page.js';
import { mountStudentsPage }     from '../features/students/students.page.js';
import { mountCoursesPage }      from '../features/courses/courses.page.js';
import { mountEnrollmentsPage }  from '../features/enrollments/enrollments.page.js';
import { mountLoginPage }        from '../features/auth/login.page.js';
import { mountRegisterPage }     from '../features/auth/register.page.js';

export const routes = {
  '/':             mountDashboardPage,
  '/students':     mountStudentsPage,
  '/courses':      mountCoursesPage,
  '/enrollments':  mountEnrollmentsPage,
  '/login':        mountLoginPage,
  '/register':     mountRegisterPage,
};

// Paths that don't require authentication
export const publicRoutes = ['/login', '/register'];