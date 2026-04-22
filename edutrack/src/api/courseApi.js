import { http } from '../lib/http.js';

export const courseApi = {
  list:   ()    => http.get('/api/courses'),
  create: (dto) => http.post('/api/courses', dto),
  remove: (id)  => http.del(`/api/courses/${id}`),
};