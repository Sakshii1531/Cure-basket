const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  // Who sent it: the customer, an admin/chemist, the AI bot (Phase 2), or a
  // system note (e.g. "Dr. X joined the chat").
  sender: {
    type: String,
    enum: ['user', 'admin', 'bot', 'system'],
    required: true,
  },
  senderName: { type: String, trim: true, default: '' },
  text: { type: String, required: true, trim: true },

  readByAdmin: { type: Boolean, default: false },
  readByUser: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

// Thread fetch + polling (`?since=`) both read messages of a conversation in order.
messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
