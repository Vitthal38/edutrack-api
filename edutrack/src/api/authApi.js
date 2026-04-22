import { http } from '../lib/http.js';

export const authApi = {
  login:    (credentials) => http.post('/api/auth/login', credentials),
  register: (data)        => http.post('/api/auth/register', data),
};