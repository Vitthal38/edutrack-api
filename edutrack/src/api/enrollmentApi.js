import { http } from '../lib/http.js';

export const enrollmentApi = {
  list:   ()    => http.get('/api/enrollments'),
  create: (dto) => http.post('/api/enrollments', dto),
  remove: (id)  => http.del(`/api/enrollments/${id}`),
};