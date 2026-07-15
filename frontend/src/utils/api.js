import axios from 'axios';

// With the Vite proxy, all /api calls go through :5173 → :5001 in development.
// Cookies are same-origin, so withCredentials works automatically.
// In custom/production environments, VITE_API_URL can specify a direct backend API address.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Inject Bearer token for cross-domain deployments
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cb_token');
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401: wipe the local token and notify AuthContext via a custom DOM event.
// We can't import AuthContext here (circular dep), so we use a lightweight event bus.
// Skip auto-logout for endpoints that intentionally return 401 for wrong credentials.
const SKIP_AUTO_LOGOUT_URLS = ['/auth/me/password'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const shouldSkip = SKIP_AUTO_LOGOUT_URLS.some(u => url.includes(u));
    if (error.response?.status === 401 && !shouldSkip) {
      localStorage.removeItem('cb_token');
      window.dispatchEvent(new Event('cb:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

