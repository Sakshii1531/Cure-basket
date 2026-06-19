const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Settings = require('../models/Settings');
const sanitizeError = require('../utils/sanitizeError');
const { notifyChemist, emailReplyToCustomer } = require('../services/chatNotifications');
const chatBot = require('../services/chatBot');
const { emitNewMessage, emitConversationUpdated } = require('../socket');

// ── helpers ──────────────────────────────────────────────────────────────────

// Whether live support is marked online (chemist toggles this from the admin
// Live Chat page; persisted via the Settings system as type `support_chat`).
const isSupportOnline = async () => {
  const s = await Settings.findOne({ type: 'support_chat' });
  return s?.data?.online === true;
};

// An anonymous visitor proves ownership of a conversation by presenting the same
// sessionId (a UUID held only in their browser). Logged-in users match by id.
const ownsConversation = (conv, req) => {
  const sessionId = req.body?.sessionId || req.query?.sessionId;
  if (sessionId && conv.customer.sessionId === sessionId) return true;
  if (req.user && conv.customer.user && conv.customer.user.equals(req.user._id)) return true;
  return false;
};

// All conversations belonging to a visitor identity (logged-in user across
// devices, or an anonymous browser's sessionId). Used to resume the active
// thread and to assemble the full, continuous chat history.
const identityFinder = (req, sessionId) =>
  req.user
    ? { $or: [{ 'customer.user': req.user._id }, { 'customer.sessionId': sessionId }] }
    : { 'customer.sessionId': sessionId };

// A friendly opening line tailored to whether we've seen this visitor before.
// Returned to the client (not persisted) so a brand-new conversation still
// reports `messages: []`.
const buildGreeting = (name, isReturning) => {
  const first = (name || '').trim().split(/\s+/)[0];
  if (isReturning && first) return `Welcome back, ${first}! 👋 Good to see you again — how can I help you today?`;
  if (isReturning) return 'Welcome back! 👋 How can we help you today?';
  if (first) return `Hi ${first}! 👋 Welcome to CureBasket. How can we help you today?`;
  return 'Hi there! Welcome to CureBasket. How can we help you today?';
};

// ── customer endpoints (optionalAuth) ───────────────────────────────────────

// @desc  Start or resume the visitor's open conversation
// @route POST /api/chat/conversations
exports.startConversation = async (req, res) => {
  try {
    const { sessionId, name, email, subject } = req.body;

    const customer = req.user
      ? { user: req.user._id, name: req.user.name, email: req.user.email, sessionId }
      : { user: null, name: name || '', email: email || '', sessionId };

    const finder = identityFinder(req, sessionId);

    // Resume the most recent non-resolved conversation for this visitor.
    let conversation = await Conversation.findOne({
      ...finder,
      status: { $ne: 'resolved' },
    }).sort('-lastMessageAt');

    if (!conversation) {
      conversation = await Conversation.create({ customer, subject: subject || '' });
    } else {
      // Enrich the existing conversation with any identity we just learned —
      // a logged-in account, or the name/email a guest typed in the pre-chat
      // form (otherwise it would stay an anonymous "Guest").
      let changed = false;
      if (req.user && !conversation.customer.user) {
        conversation.customer.user = req.user._id;
        conversation.customer.name = req.user.name;
        conversation.customer.email = req.user.email;
        changed = true;
      }
      if (name && !conversation.customer.name) { conversation.customer.name = name; changed = true; }
      if (email && !conversation.customer.email) { conversation.customer.email = email; changed = true; }
      if (subject && !conversation.subject) { conversation.subject = subject; changed = true; }
      if (changed) await conversation.save();
    }

    // Full continuous history across ALL of this visitor's conversations
    // (including previously resolved ones), so a returning visitor sees their
    // whole thread. New messages are still posted to `conversation` (the active
    // thread) above.
    const convIds = (await Conversation.find(finder).select('_id')).map((c) => c._id);
    const messages = await Message.find({ conversation: { $in: convIds } }).sort('createdAt');

    const isReturning = messages.length > 0;

    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages,
        isReturning,
        greeting: buildGreeting(conversation.customer.name, isReturning),
        supportOnline: await isSupportOnline(),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc  Link a guest's prior (anonymous) conversations to the now-logged-in
//        account, so chat history follows them across sessions and devices.
// @route POST /api/chat/link   (protect)
exports.linkGuestConversations = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(200).json({ success: true, data: { linked: 0 } });

    const result = await Conversation.updateMany(
      { 'customer.sessionId': sessionId, 'customer.user': null },
      { $set: { 'customer.user': req.user._id, 'customer.name': req.user.name, 'customer.email': req.user.email } }
    );
    res.status(200).json({ success: true, data: { linked: result.modifiedCount || 0 } });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc  Poll for new messages (and report status / support availability)
// @route GET /api/chat/conversations/:id/messages?since=<ISO>&sessionId=<id>
exports.pollMessages = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });
    if (!ownsConversation(conversation, req)) {
      return res.status(403).json({ success: false, error: 'Not authorized for this conversation' });
    }

    const filter = { conversation: conversation._id };
    if (req.query.since) {
      const since = new Date(req.query.since);
      if (!isNaN(since)) filter.createdAt = { $gt: since };
    }
    const messages = await Message.find(filter).sort('createdAt');

    // Mark admin messages as seen by the user + refresh presence.
    await Message.updateMany(
      { conversation: conversation._id, sender: { $in: ['admin', 'bot', 'system'] }, readByUser: false },
      { readByUser: true }
    );
    conversation.lastUserSeenAt = new Date();
    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        messages,
        status: conversation.status,
        agentName: conversation.assignedAdmin ? 'Support' : null,
        supportOnline: await isSupportOnline(),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc  Customer sends a message
// @route POST /api/chat/conversations/:id/messages
exports.postMessage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });
    if (!ownsConversation(conversation, req)) {
      return res.status(403).json({ success: false, error: 'Not authorized for this conversation' });
    }

    const supportOnline = await isSupportOnline();
    // Pre-message state for the (offline) chemist-notification debounce: notify
    // on the first message or when they'd read everything, not every follow-up.
    const hadMessages = !!conversation.lastMessageText;
    const wasUnread = conversation.unreadForAdmin;

    const message = await Message.create({
      conversation: conversation._id,
      sender: 'user',
      senderName: conversation.customer.name || 'Customer',
      text: req.body.text,
      readByUser: true,
    });

    conversation.lastMessageAt = message.createdAt;
    conversation.lastMessageText = message.text;
    conversation.lastMessageSender = 'user';
    conversation.lastUserSeenAt = message.createdAt;

    // Push the customer's own message live (their other open tabs see it, and
    // any admin viewing the thread sees it instantly).
    emitNewMessage(conversation, message);

    // When support is online and no human has taken over, the AI assistant
    // fields the message first (escalating to a human if it can't help). Its
    // reply is pushed live to the customer by chatBot.respond.
    if (supportOnline && conversation.status !== 'human_active') {
      await conversation.save();
      emitConversationUpdated(conversation);
      res.status(201).json({ success: true, data: message });
      chatBot.respond(conversation._id).catch((e) => console.error('[chat] bot failed:', e.message));
      return;
    }

    // Support offline (async ticket) or a human is mid-conversation → flag the
    // chemist directly, as in Phase 1.
    conversation.unreadForAdmin = true;
    if (conversation.status !== 'human_active') conversation.status = 'waiting_human';
    await conversation.save();
    emitConversationUpdated(conversation);

    if (conversation.status !== 'human_active' && (!hadMessages || !wasUnread)) {
      notifyChemist(conversation, message.text);
    }

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// ── admin endpoints (protect + authorize admin/superadmin) ──────────────────

// @desc  Inbox list
// @route GET /api/chat/admin/conversations?status=
exports.getConversations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const conversations = await Conversation.find(filter)
      .populate('assignedAdmin', 'name')
      .populate('customer.user', 'name email')
      .sort('-lastMessageAt')
      .limit(100);
    res.status(200).json({ success: true, count: conversations.length, data: conversations });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc  Full thread (marks it read for admin)
// @route GET /api/chat/admin/conversations/:id
exports.getAdminConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('assignedAdmin', 'name')
      .populate('customer.user', 'name email');
    if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });

    await Message.updateMany(
      { conversation: conversation._id, sender: 'user', readByAdmin: false },
      { readByAdmin: true }
    );
    if (conversation.unreadForAdmin) {
      conversation.unreadForAdmin = false;
      await conversation.save();
    }

    // Show the chemist the visitor's full continuous history (across all their
    // conversations — logged-in across devices, or the same guest sessionId),
    // not just this one thread, so prior context is always visible.
    const identity = conversation.customer.user
      ? { $or: [{ 'customer.user': conversation.customer.user }, { 'customer.sessionId': conversation.customer.sessionId }] }
      : { 'customer.sessionId': conversation.customer.sessionId };
    const convIds = (await Conversation.find(identity).select('_id')).map((c) => c._id);
    const messages = await Message.find({ conversation: { $in: convIds } }).sort('createdAt');

    res.status(200).json({ success: true, data: { conversation, messages } });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc  Admin/chemist replies
// @route POST /api/chat/admin/conversations/:id/messages
exports.postAdminMessage = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });

    const message = await Message.create({
      conversation: conversation._id,
      sender: 'admin',
      senderName: req.user.name || 'Support',
      text: req.body.text,
      readByAdmin: true,
    });

    conversation.assignedAdmin = req.user._id;
    conversation.status = 'human_active';
    conversation.lastMessageAt = message.createdAt;
    conversation.lastMessageText = message.text;
    conversation.lastMessageSender = 'admin';
    conversation.unreadForAdmin = false;
    await conversation.save();

    // Push the reply to the customer (and any other admin) live.
    emitNewMessage(conversation, message);
    emitConversationUpdated(conversation);

    // If the customer has drifted away (>60s since last seen), email them too —
    // the live push only lands if a tab is still connected.
    if (Date.now() - new Date(conversation.lastUserSeenAt).getTime() > 60 * 1000) {
      emailReplyToCustomer(conversation, message.text);
    }

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc  Update conversation status (e.g. resolve)
// @route PUT /api/chat/admin/conversations/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });
    conversation.status = req.body.status;
    await conversation.save();
    emitConversationUpdated(conversation);
    res.status(200).json({ success: true, data: conversation });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc  Unread conversation count for the admin notification bell
// @route GET /api/chat/admin/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Conversation.countDocuments({ unreadForAdmin: true });
    res.status(200).json({ success: true, data: { count } });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};
