import axios from 'axios';

// With the Vite proxy, all /api calls go through :5173 → :5001 in development.
// Cookies are same-origin, so withCredentials works automatically.
// In custom/production environments, VITE_API_URL can specify a direct backend API address.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Interceptor to inject the token from localStorage if it exists (for cross-domain deployments)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cb_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

