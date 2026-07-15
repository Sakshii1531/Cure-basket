const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');
const sanitizeError = require('../utils/sanitizeError');

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email address' });
    }

    // Basic email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    let subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    const frontendOrigin = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(',')[0].trim();

    if (subscriber) {
      if (subscriber.status === 'subscribed') {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed!',
          data: subscriber
        });
      } else {
        // Resubscribe
        subscriber.status = 'subscribed';
        await subscriber.save();

        // Send welcome email upon resubscription
        try {
          await sendWelcomeEmail(subscriber.email, frontendOrigin);
        } catch (mailErr) {
          console.error('Failed to send welcome email:', mailErr.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Thank you for subscribing again!',
          data: subscriber
        });
      }
    }

    // New subscriber
    subscriber = await Subscriber.create({ email: email.toLowerCase() });

    // Send welcome email
    try {
      await sendWelcomeEmail(subscriber.email, frontendOrigin);
    } catch (mailErr) {
      console.error('Failed to send welcome email:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data: subscriber
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/subscribers/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email address' });
    }

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(200).json({
        success: true,
        message: 'You have already unsubscribed.'
      });
    }

    subscriber.status = 'unsubscribed';
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

// Helper function to send welcome email
async function sendWelcomeEmail(email, frontendOrigin) {
  const unsubscribeLink = `${frontendOrigin}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #f3f4f6; padding-bottom: 20px;">
        <h2 style="color: #006D6D; margin: 0; font-size: 28px; font-weight: 800; tracking-wide: -0.025em;">Cure<span style="color: #eab308;">Basket</span></h2>
        <p style="color: #6b7280; margin: 6px 0 0 0; font-size: 15px; font-weight: 500;">Good news for your inbox</p>
      </div>
      
      <div style="color: #374151; line-height: 1.6; font-size: 16px; font-weight: 400; padding: 0 10px;">
        <p style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px;">Welcome to CureBasket!</p>
        <p>Thanks for subscribing to our newsletter! We're excited to have you on board.</p>
        <p>From now on, you'll be the first to get updates on health tips, exclusive discounts, new product releases, and insightful medical reads.</p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${frontendOrigin}" style="background-color: #006D6D; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; transition: background-color 0.2s; box-shadow: 0 4px 10px rgba(0, 109, 109, 0.2);">Explore CureBasket</a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">If you ever have any questions or feedback, just hit reply to any of our emails. We'd love to hear from you!</p>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center; color: #9ca3af; font-size: 12px; line-height: 1.6; font-weight: 500;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CureBasket. All rights reserved.</p>
        <p style="margin: 6px 0 0 0;">You are receiving this because you opted in to our newsletter. <a href="${unsubscribeLink}" style="color: #006D6D; text-decoration: underline; font-weight: 600;">Unsubscribe</a> at any time.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to CureBasket Newsletter! 🩺',
    html
  });
}

// @desc    Delete a subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private/Admin
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
    await subscriber.deleteOne();
    res.status(200).json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};
