import axios from 'axios';

// With the Vite proxy, all /api calls go through :5173 → :5001.
// Cookies are same-origin, so withCredentials works automatically.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default api;
