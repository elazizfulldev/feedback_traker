import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/*===== Request interceptor: attach token =============*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/*===== Response interceptor: handle 401 =============*/
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

/*==== Auth API =====*/
export const authApi = {
  register: (data) => api.post('/register', data),
  login:    (data) => api.post('/login', data),
  logout:   ()     => api.post('/logout'),
  getUser:  ()     => api.get('/user'),
};

/*==== Feedback API =====*/
export const feedbackApi = {
  list:   (page = 1, ownerId = '') => api.get(`/feedback?page=${page}${ownerId ? `&owner_id=${ownerId}` : ''}`),
  create: (data)     => api.post('/feedback', data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id)       => api.delete(`/feedback/${id}`),
  stats:  (ownerId = '') => api.get(`/feedback/stats${ownerId ? `?owner_id=${ownerId}` : ''}`),
  export: (ownerId = '') => api.get(`/feedback/export${ownerId ? `?owner_id=${ownerId}` : ''}`, { responseType: 'blob' }),
};

/*====== Profile API =========*/
export const profileApi = {
  get:          ()     => api.get('/profile'),
  update:       (data) => api.put('/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

/*==== Users API (admin only) ========*/
export const usersApi = {
  list:   (page = 1) => api.get(`/users?page=${page}`),
  create: (data)     => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id)       => api.delete(`/users/${id}`),
};

export default api;
