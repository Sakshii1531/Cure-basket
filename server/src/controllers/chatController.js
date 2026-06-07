const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Settings = require('../models/Settings');
const sendEmail = require('../utils/sendEmail');
const sanitizeError = require('../utils/sanitizeError');

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

const notifyChemist = async (conv, text) => {
  try {
    const to = process.env.SUPPORT_NOTIFY_EMAIL || process.env.SUPER_ADMIN_EMAIL;
    if (!to) return;
    const who = conv.customer.name || conv.customer.email || 'A website visitor';
    await sendEmail({
      to,
      subject: `New CureBasket chat from ${who}`,
      html: `
        <div style="font-family:sans-serif">
          <h2>New live chat message</h2>
          <p><strong>${who}</strong> sent:</p>
          <blockquote style="border-left:3px solid #006D6D;padding-left:12px;color:#333">${text}</blockquote>
          <p>Open the admin panel → <strong>Live Chat</strong> to reply.</p>
        </div>`,
    });
  } catch (err) {
    console.error('[chat] chemist notification failed:', err.message);
  }
};

const emailReplyToCustomer = async (conv, text) => {
  try {
    if (!conv.customer.email) return;
    await sendEmail({
      to: conv.customer.email,
      subject: 'CureBasket replied to your question',
      html: `
        <div style="font-family:sans-serif">
          <p>Hi ${conv.customer.name || 'there'}, our team replied to your chat:</p>
          <blockquote style="border-left:3px solid #006D6D;padding-left:12px;color:#333">${text}</blockquote>
          <p>Visit the website and open the chat to continue the conversation.</p>
        </div>`,
    });
  } catch (err) {
    console.error('[chat] customer reply email failed:', err.message);
  }
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

    // Resume the most recent non-resolved conversation for this visitor.
    const finder = req.user
      ? { $or: [{ 'customer.user': req.user._id }, { 'customer.sessionId': sessionId }] }
      : { 'customer.sessionId': sessionId };

    let conversation = await Conversation.findOne({
      ...finder,
      status: { $ne: 'resolved' },
    }).sort('-lastMessageAt');

    if (!conversation) {
      conversation = await Conversation.create({ customer, subject: subject || '' });
    } else if (req.user && !conversation.customer.user) {
      // Visitor logged in mid-conversation — attach their account.
      conversation.customer.user = req.user._id;
      conversation.customer.name = req.user.name;
      conversation.customer.email = req.user.email;
      await conversation.save();
    }

    const messages = await Message.find({ conversation: conversation._id }).sort('createdAt');
    res.status(200).json({
      success: true,
      data: { conversation, messages, supportOnline: await isSupportOnline() },
    });
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

    // Capture pre-message state to decide whether to email the chemist:
    // notify on the first message, or when they'd previously read everything —
    // but not for every follow-up in an already-unread burst (avoids spam).
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
    conversation.unreadForAdmin = true;
    if (conversation.status !== 'human_active') conversation.status = 'waiting_human';
    await conversation.save();

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

    const messages = await Message.find({ conversation: conversation._id }).sort('createdAt');
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

    // If the customer has drifted away (>60s since last seen), email them.
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
