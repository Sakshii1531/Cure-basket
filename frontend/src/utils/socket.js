import { io } from 'socket.io-client';

// Resolve the Socket.IO origin. In dev, VITE_API_URL is unset and we connect to
// the same origin (Vite proxies /socket.io → backend, see vite.config.js). In
// production the frontend talks to a separate backend via VITE_API_URL
// (e.g. https://api.example.com/api) — strip the trailing /api for the socket.
const SOCKET_URL = (() => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return undefined; // same-origin (no env set)
  // Strip a trailing /api. For a relative value like "/api" this yields "",
  // which we normalise to undefined so the socket connects same-origin (the
  // VPS case, where Nginx serves both the SPA and the API on one domain).
  return apiUrl.replace(/\/api\/?$/, '') || undefined;
})();

// Create a (not-yet-connected) chat socket. `auth` is a function so the JWT and
// guest sessionId are read fresh on every (re)connect — important after login.
export const createChatSocket = () =>
  io(SOCKET_URL, {
    path: '/socket.io',
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: true,
    auth: (cb) =>
      cb({
        token: localStorage.getItem('cb_token') || undefined,
        sessionId: localStorage.getItem('cb_chat_session') || undefined,
      }),
  });

// Stable per-browser id that owns an anonymous conversation (shared with the
// chat REST calls). Created on first use and persisted in localStorage.
export const getChatSessionId = () => {
  let id = localStorage.getItem('cb_chat_session');
  if (!id) {
    id = crypto.randomUUID?.() || `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('cb_chat_session', id);
  }
  return id;
};
