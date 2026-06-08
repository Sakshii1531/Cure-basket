const sendEmail = require('../utils/sendEmail');

// Email the chemist that a conversation needs a human. Best-effort: never throws
// into the request path.
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
          <h2>A customer needs help</h2>
          <p><strong>${who}</strong> asked:</p>
          <blockquote style="border-left:3px solid #006D6D;padding-left:12px;color:#333">${text}</blockquote>
          <p>Open the admin panel → <strong>Live Chat</strong> to reply.</p>
        </div>`,
    });
  } catch (err) {
    console.error('[chat] chemist notification failed:', err.message);
  }
};

// Email the customer an admin reply when they've left the widget.
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

module.exports = { notifyChemist, emailReplyToCustomer };
