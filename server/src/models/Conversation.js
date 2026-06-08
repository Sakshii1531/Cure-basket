const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  // Customer identity — logged-in users link via `user`, anonymous visitors are
  // tracked by `sessionId` (a UUID persisted in the browser's localStorage).
  customer: {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', default: null },
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    sessionId: { type: String, required: true, index: true },
  },

  // Conversation lifecycle. `bot` is reserved for Phase 2 (AI assistant).
  status: {
    type: String,
    enum: ['bot', 'waiting_human', 'human_active', 'resolved', 'async'],
    default: 'waiting_human',
  },

  assignedAdmin: { type: mongoose.Schema.ObjectId, ref: 'User', default: null },
  subject: { type: String, trim: true, default: '' },

  // Drives inbox sorting + the unread badge for the chemist.
  lastMessageAt: { type: Date, default: Date.now },
  unreadForAdmin: { type: Boolean, default: true },

  // Denormalized last message so the admin inbox list needs no per-row join.
  lastMessageText: { type: String, default: '' },
  lastMessageSender: { type: String, default: '' },

  // Last time the customer polled or sent — used to decide whether to email
  // them an admin reply (they've left) vs. let them see it live in the widget.
  lastUserSeenAt: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Live presence: the customer polls every few seconds while the widget is open,
// refreshing lastUserSeenAt. When they close the tab/widget, polling stops and
// this goes false within ~15s — so the admin sees them drop to "Away".
conversationSchema.virtual('customerOnline').get(function () {
  if (!this.lastUserSeenAt) return false;
  return Date.now() - new Date(this.lastUserSeenAt).getTime() < 15000;
});

// Inbox queries (filter by status, newest activity first) and owner lookups.
conversationSchema.index({ status: 1, lastMessageAt: -1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ 'customer.user': 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
