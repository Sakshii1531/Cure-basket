const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');
const Blog = require('../models/Blog');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue({ id: 'mock-id' }));

beforeAll(() => db.connect());
afterEach(async () => {
  await db.clear();
  jest.clearAllMocks();
});
afterAll(() => db.disconnect());

const VALID_ADMIN = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123',
};

const VALID_USER = {
  name: 'Normal User',
  email: 'user@example.com',
  password: 'password123',
};

let adminCookie;
let userCookie;

const setupUsers = async () => {
  // Register Admin
  const adminRes = await request(app).post('/api/auth/register').send(VALID_ADMIN);
  adminCookie = adminRes.headers['set-cookie'];
  await User.updateOne({ email: VALID_ADMIN.email }, { role: 'superadmin' });

  // Register Normal User
  const userRes = await request(app).post('/api/auth/register').send(VALID_USER);
  userCookie = userRes.headers['set-cookie'];
};

beforeEach(async () => {
  await setupUsers();
  jest.clearAllMocks();
});

describe('Newsletter Subscribers API', () => {
  describe('POST /api/subscribers', () => {
    it('should successfully subscribe a new email', async () => {
      const sendEmail = require('../utils/sendEmail');
      const res = await request(app)
        .post('/api/subscribers')
        .send({ email: 'newsubscriber@example.com' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Successfully subscribed');
      expect(res.body.data.email).toBe('newsubscriber@example.com');
      expect(res.body.data.status).toBe('subscribed');

      // Verify subscriber stored in DB
      const sub = await Subscriber.findOne({ email: 'newsubscriber@example.com' });
      expect(sub).toBeDefined();
      expect(sub.status).toBe('subscribed');

      // Verify welcome email was triggered
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail.mock.calls[0][0].to).toBe('newsubscriber@example.com');
      expect(sendEmail.mock.calls[0][0].subject).toContain('Welcome');
    });

    it('should fail with invalid email format', async () => {
      const res = await request(app)
        .post('/api/subscribers')
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('valid email');
    });

    it('should return 200 with status message if already subscribed', async () => {
      const sendEmail = require('../utils/sendEmail');
      
      // Subscribe first time
      await request(app)
        .post('/api/subscribers')
        .send({ email: 'duplicate@example.com' });
      
      jest.clearAllMocks();

      // Subscribe second time
      const res = await request(app)
        .post('/api/subscribers')
        .send({ email: 'duplicate@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('already subscribed');
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should resubscribe and send welcome email if unsubscribed previously', async () => {
      const sendEmail = require('../utils/sendEmail');
      
      // Subscribe first time
      await request(app)
        .post('/api/subscribers')
        .send({ email: 'resub@example.com' });
      
      // Unsubscribe
      await request(app)
        .post('/api/subscribers/unsubscribe')
        .send({ email: 'resub@example.com' });
      
      jest.clearAllMocks();

      // Subscribe again
      const res = await request(app)
        .post('/api/subscribers')
        .send({ email: 'resub@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('subscribing again');
      
      const sub = await Subscriber.findOne({ email: 'resub@example.com' });
      expect(sub.status).toBe('subscribed');
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/subscribers/unsubscribe', () => {
    it('should successfully unsubscribe an active subscriber', async () => {
      // First subscribe
      await Subscriber.create({ email: 'unsub@example.com', status: 'subscribed' });

      const res = await request(app)
        .post('/api/subscribers/unsubscribe')
        .send({ email: 'unsub@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('successfully unsubscribed');

      const sub = await Subscriber.findOne({ email: 'unsub@example.com' });
      expect(sub.status).toBe('unsubscribed');
    });

    it('should return 404 for non-existent subscriber email', async () => {
      const res = await request(app)
        .post('/api/subscribers/unsubscribe')
        .send({ email: 'nonexistent@example.com' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('not found');
    });
  });

  describe('GET /api/subscribers', () => {
    it('should allow admin to list all subscribers', async () => {
      await Subscriber.create({ email: 'sub1@example.com' });
      await Subscriber.create({ email: 'sub2@example.com' });

      const res = await request(app)
        .get('/api/subscribers')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data.length).toBe(2);
    });

    it('should reject access to unauthorized users (non-admin)', async () => {
      const res = await request(app)
        .get('/api/subscribers')
        .set('Cookie', userCookie);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject access to unauthenticated users', async () => {
      const res = await request(app).get('/api/subscribers');
      expect(res.status).toBe(401);
    });
  });

  describe('Blog Publication Notifications', () => {
    it('should send notifications to active subscribers when a blog is published', async () => {
      const sendEmail = require('../utils/sendEmail');
      
      // Create subscribers
      await Subscriber.create({ email: 'active1@example.com', status: 'subscribed' });
      await Subscriber.create({ email: 'active2@example.com', status: 'subscribed' });
      await Subscriber.create({ email: 'unsubscribed@example.com', status: 'unsubscribed' });

      // Create a published blog
      const res = await request(app)
        .post('/api/blogs')
        .set('Cookie', adminCookie)
        .send({
          title: 'Healthy Living',
          isPublished: true,
          sections: [{ title: 'Intro', content: 'Some medical tip content here.' }]
        });

      expect(res.status).toBe(201);

      // Wait for background DB query and sendEmail promises to resolve
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify that notificationSent is true in DB
      const blog = await Blog.findOne({ title: 'Healthy Living' });
      expect(blog.notificationSent).toBe(true);

      // Verify emails were sent to both active subscribers, and not to the unsubscribed one
      expect(sendEmail).toHaveBeenCalledTimes(2);
      
      const sentEmails = sendEmail.mock.calls.map(c => c[0].to);
      expect(sentEmails).toContain('active1@example.com');
      expect(sentEmails).toContain('active2@example.com');
      expect(sentEmails).not.toContain('unsubscribed@example.com');
      
      expect(sendEmail.mock.calls[0][0].subject).toContain('Healthy Living');
    });

    it('should not send notifications if blog is a draft', async () => {
      const sendEmail = require('../utils/sendEmail');
      await Subscriber.create({ email: 'active@example.com', status: 'subscribed' });

      // Create a draft blog
      const res = await request(app)
        .post('/api/blogs')
        .set('Cookie', adminCookie)
        .send({
          title: 'Draft Post',
          isPublished: false,
          sections: [{ title: 'Intro', content: 'Draft content.' }]
        });

      expect(res.status).toBe(201);

      // Wait for background DB query and sendEmail promises to resolve
      await new Promise(resolve => setTimeout(resolve, 100));

      const blog = await Blog.findOne({ title: 'Draft Post' });
      expect(blog.notificationSent).toBe(false);
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
});
