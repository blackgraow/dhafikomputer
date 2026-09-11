import axios from 'axios';

// Dynamic base URL with support for VITE_API_URL env variable and production fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://dhafikomputer-backend.vercel.app/api' : '/api');

// Helper to normalize image URLs for production & local development
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('data:image')) return url;
  if (url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
    const backendBase = API_BASE_URL.replace(/\/api\/?$/, '');
    return url.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, backendBase);
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const backendBase = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

const api = axios.create({
  baseURL: '/api',
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dhafi_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 Unauthorized errors to handle logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid session if accessing protected admin area
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('dhafi_auth_token');
        localStorage.removeItem('dhafi_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
