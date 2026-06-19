const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const {
  startConversation,
  pollMessages,
  postMessage,
  linkGuestConversations,
  getConversations,
  getAdminConversation,
  postAdminMessage,
  updateStatus,
  getUnreadCount,
} = require('../controllers/chatController');

const { protect, authorize, can } = require('../middlewares/authMiddleware');
const optionalAuth = require('../middlewares/optionalAuth');
const validate = require('../middlewares/validate');
const { startConversationRules, postMessageRules, statusRules } = require('../validators/chatValidators');

// Throttle customer messages to curb spam / bot abuse (per IP).
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 20 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'You are sending messages too quickly. Please slow down.' },
});

// ── customer-facing (anonymous allowed) ──────────────────────────────────────
router.post('/conversations', optionalAuth, startConversationRules, validate, startConversation);
router.get('/conversations/:id/messages', optionalAuth, pollMessages);
router.post('/conversations/:id/messages', optionalAuth, chatLimiter, postMessageRules, validate, postMessage);

// Link a guest's anonymous chat history to the account once they log in.
router.post('/link', protect, linkGuestConversations);

// ── admin / chemist ──────────────────────────────────────────────────────────
router.use('/admin', protect, authorize('admin', 'superadmin'));
router.get('/admin/unread-count', can('chat', 'read'), getUnreadCount);
router.get('/admin/conversations', can('chat', 'read'), getConversations);
router.get('/admin/conversations/:id', can('chat', 'read'), getAdminConversation);
router.post('/admin/conversations/:id/messages', can('chat', 'write'), postMessageRules, validate, postAdminMessage);
router.put('/admin/conversations/:id/status', can('chat', 'write'), statusRules, validate, updateStatus);

module.exports = router;
