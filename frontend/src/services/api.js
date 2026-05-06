import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor: attach token ──────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth API ───────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/register', data),
  login:    (data) => api.post('/login', data),
  logout:   ()     => api.post('/logout'),
  getUser:  ()     => api.get('/user'),
};

// ── Feedback API ───────────────────────────────────
export const feedbackApi = {
  list:   (page = 1) => api.get(`/feedback?page=${page}`),
  create: (data)     => api.post('/feedback', data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id)       => api.delete(`/feedback/${id}`),
  stats:  ()         => api.get('/feedback/stats'),
};

export default api;
