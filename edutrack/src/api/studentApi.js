import { http } from '../lib/http.js';

export const studentApi = {
  list:   ()    => http.get('/api/students'),
  create: (dto) => http.post('/api/students', dto),
  remove: (id)  => http.del(`/api/students/${id}`),
};