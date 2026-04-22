import { API_BASE_URL } from '../config/env.js';
import { auth } from './auth.js';

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  // Attach auth token if user is logged in
  const token = auth.getToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle token expiration / invalid token
  if (res.status === 401 && !path.startsWith('/api/auth/')) {
    auth.logout();
    window.location.href = '/login';
    throw new ApiError('Session expired', { status: 401 });
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    throw new ApiError(
      (data && data.message) || `Request failed: ${res.status}`,
      { status: res.status, data }
    );
  }
  return data;
}

export const http = {
  get:  (p)    => request(p),
  post: (p, b) => request(p, { method: 'POST', body: b }),
  put:  (p, b) => request(p, { method: 'PUT',  body: b }),
  del:  (p)    => request(p, { method: 'DELETE' }),
};