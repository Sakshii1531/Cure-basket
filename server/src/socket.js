const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Conversation = require('./models/Conversation');
const redis = require('./config/redis');

// ─────────────────────────────────────────────────────────────────────────────
// Socket.IO live-chat layer.
//
// Sits alongside the REST API (which stays the source of truth for persistence
// and the offline fallback). Sockets only PUSH already-saved messages/state to
// the right clients in real time.
//
// Cluster note: the API runs under PM2 cluster mode. We force `websocket`-only
// transport so a connection stays pinned to one worker (no sticky long-polling
// handshake needed), and use the Redis adapter so room broadcasts reach clients
// connected to *other* workers. When Redis is disabled (dev/test) we fall back
// to the default in-memory adapter — fine for a single worker.
// ─────────────────────────────────────────────────────────────────────────────

let io = null;

const ADMIN_ROOM = 'admins';
const convRoom = (id) => `conv:${id}`;

// Whether a user may act as a chemist/admin on chat (mirrors the REST gate:
// authorize('admin','superadmin') + can('chat','read')).
const isChatAdmin = (user) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'superadmin') return true;
  return typeof user.can === 'function' && user.can('chat', 'read');
};

// Resolve a user from a JWT. Returns null when absent/invalid (guests allowed).
const userFromToken = async (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).populate('customRole');
  } catch {
    return null;
  }
};

// Same ownership rule as chatController.ownsConversation, for socket clients.
const canAccessConversation = (conv, socket) => {
  if (!conv) return false;
  if (isChatAdmin(socket.user)) return true;
  const sessionId = socket.handshake?.auth?.sessionId;
  if (sessionId && conv.customer.sessionId === sessionId) return true;
  if (socket.user && conv.customer.user && conv.customer.user.equals(socket.user._id)) return true;
  return false;
};

const initSocket = (server, corsOptions) => {
  io = new Server(server, {
    path: '/socket.io',
    transports: ['websocket'],
    cors: corsOptions,
  });

  // Cross-worker broadcasts via Redis (real ioredis exposes `.duplicate`; the
  // disabled stub does not, so we simply skip the adapter then).
  if (redis && typeof redis.duplicate === 'function') {
    try {
      const pubClient = redis.duplicate();
      const subClient = redis.duplicate();
      io.adapter(createAdapter(pubClient, subClient));
      console.log('✅ Socket.IO using Redis adapter (cluster-ready).');
    } catch (err) {
      console.warn('⚠️ Socket.IO Redis adapter unavailable, using in-memory:', err.message);
    }
  }

  // Attach identity (logged-in user and/or guest sessionId) to every socket.
  io.use(async (socket, next) => {
    socket.user = await userFromToken(socket.handshake?.auth?.token);
    next();
  });

  io.on('connection', (socket) => {
    // Chemists/admins listen to the global inbox feed.
    if (isChatAdmin(socket.user)) socket.join(ADMIN_ROOM);

    // Join a specific conversation room (after an ownership check).
    socket.on('conversation:join', async ({ conversationId } = {}) => {
      if (!conversationId) return;
      try {
        const conv = await Conversation.findById(conversationId);
        if (canAccessConversation(conv, socket)) socket.join(convRoom(conversationId));
      } catch {
        /* ignore — client keeps the REST fallback */
      }
    });

    socket.on('conversation:leave', ({ conversationId } = {}) => {
      if (conversationId) socket.leave(convRoom(conversationId));
    });
  });

  return io;
};

// ── Emitters used by controllers / services (no-ops before init) ─────────────

const emitToConversation = (conversationId, event, payload) => {
  if (io && conversationId) io.to(convRoom(conversationId)).emit(event, payload);
};

const emitToAdmins = (event, payload) => {
  if (io) io.to(ADMIN_ROOM).emit(event, payload);
};

// A new message was persisted: push it to the conversation's participants, and
// (for non-bot-internal traffic) refresh the admin inbox.
const emitNewMessage = (conversation, message) => {
  const conversationId = conversation._id || conversation;
  emitToConversation(conversationId, 'message:new', { conversationId: String(conversationId), message });
};

const emitConversationUpdated = (conversation) => {
  emitToAdmins('conversation:updated', { conversation });
};

module.exports = {
  initSocket,
  emitToConversation,
  emitToAdmins,
  emitNewMessage,
  emitConversationUpdated,
};
