const Blog = require('../models/Blog');
const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');
const sanitizeError = require('../utils/sanitizeError');

// Helper function to send email notification to all active subscribers
async function sendBlogNotification(blog) {
  if (!blog.isPublished || blog.notificationSent) {
    return;
  }

  // To prevent double sends, mark notificationSent as true and save immediately
  blog.notificationSent = true;
  await blog.save();

  try {
    const subscribers = await Subscriber.find({ status: 'subscribed' });
    if (subscribers.length === 0) return;

    const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    const blogUrl = `${frontendOrigin}/blog/${blog.slug}`;
    const allBlogsUrl = `${frontendOrigin}/blogs`;

    // Extract first section's content as preview
    const previewContent = blog.sections?.[0]?.content
      ? (blog.sections[0].content.substring(0, 250) + '...')
      : 'Check out our latest article on CureBasket!';

    for (const sub of subscribers) {
      const unsubscribeLink = `${frontendOrigin}/unsubscribe?email=${encodeURIComponent(sub.email)}`;
      const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background-color: #006D6D; padding: 24px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">Cure<span style="color: #eab308;">Basket</span></h2>
            <p style="color: #ccf2f2; margin: 4px 0 0 0; font-size: 14px; font-weight: 500;">Your Health & Wellness Companion</p>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 30px 24px; color: #374151; font-size: 16px; line-height: 1.6;">
            <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #006D6D; font-weight: 700; margin: 0 0 8px 0;">New Blog Published</p>
            <h1 style="color: #111827; font-size: 24px; font-weight: 800; line-height: 1.25; margin: 0 0 16px 0;">${blog.title}</h1>
            
            ${blog.image ? `
              <div style="margin-bottom: 24px; text-align: center;">
                <img src="${blog.image}" alt="${blog.title}" style="max-width: 100%; height: auto; border-radius: 12px; object-fit: cover;" />
              </div>
            ` : ''}
            
            <p style="color: #4b5563; margin-bottom: 24px; font-size: 15px;">${previewContent}</p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${blogUrl}" style="background-color: #006D6D; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(0, 109, 109, 0.2);">Read Full Article</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin: 24px 0 0 0; text-align: center;">
              Or browse all our articles on the <a href="${allBlogsUrl}" style="color: #006D6D; font-weight: 600; text-decoration: none;">CureBasket Blog</a>.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6; color: #9ca3af; font-size: 12px; line-height: 1.6; font-weight: 500;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} CureBasket. All rights reserved.</p>
            <p style="margin: 6px 0 0 0;">You are receiving this because you subscribed to our newsletter. <a href="${unsubscribeLink}" style="color: #006D6D; text-decoration: underline; font-weight: 600;">Unsubscribe</a> at any time.</p>
          </div>
        </div>
      `;

      sendEmail({
        to: sub.email,
        subject: `New Blog: ${blog.title} 📚`,
        html
      }).catch(err => {
        console.error(`Failed to send blog notification email to ${sub.email}:`, err.message);
      });
    }
  } catch (err) {
    console.error('Error in sendBlogNotification background process:', err.message);
  }
}

exports.getBlogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.published === 'true') filter.isPublished = true;
    if (req.query.tag) filter.tags = req.query.tag;

    const blogs = await Blog.find(filter).sort('-createdAt');
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      $or: [{ _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null }, { slug: req.params.id }],
    });
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    
    // Dispatch subscriber notification if published
    if (blog.isPublished) {
      sendBlogNotification(blog).catch(err => console.error('Error dispatching notifications:', err));
    }

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });

    Object.assign(blog, req.body);
    await blog.save();

    // Dispatch subscriber notification if published and not sent yet
    if (blog.isPublished && !blog.notificationSent) {
      sendBlogNotification(blog).catch(err => console.error('Error dispatching notifications:', err));
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
    await blog.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

