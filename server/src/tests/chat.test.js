const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');
const User = require('../models/User');

beforeAll(() => db.connect());
afterEach(() => db.clear());
afterAll(() => db.disconnect());

const ADMIN = { name: 'Chemist', email: 'chemist@example.com', password: 'password123' };

let adminCookie;

const loginAdmin = async () => {
  const res = await request(app).post('/api/auth/register').send(ADMIN);
  adminCookie = res.headers['set-cookie'];
  await User.updateOne({ email: ADMIN.email }, { role: 'superadmin' });
};

const SESSION = 'sess-abc-123';

const startConversation = () =>
  request(app).post('/api/chat/conversations').send({ sessionId: SESSION, name: 'Visitor', email: 'v@example.com' });

describe('POST /api/chat/conversations', () => {
  it('starts a conversation anonymously', async () => {
    const res = await startConversation();
    expect(res.status).toBe(200);
    expect(res.body.data.conversation.customer.sessionId).toBe(SESSION);
    expect(res.body.data.messages).toEqual([]);
    expect(res.body.data).toHaveProperty('supportOnline');
  });

  it('resumes the same conversation for a repeat sessionId', async () => {
    const a = await startConversation();
    const b = await startConversation();
    expect(b.body.data.conversation._id).toBe(a.body.data.conversation._id);
  });

  it('rejects a missing sessionId (422)', async () => {
    const res = await request(app).post('/api/chat/conversations').send({ name: 'x' });
    expect(res.status).toBe(422);
  });
});

describe('customer messaging', () => {
  it('posts a message with the owning sessionId', async () => {
    const conv = (await startConversation()).body.data.conversation;
    const res = await request(app)
      .post(`/api/chat/conversations/${conv._id}/messages`)
      .send({ sessionId: SESSION, text: 'Do you stock Dolo 650?' });
    expect(res.status).toBe(201);
    expect(res.body.data.sender).toBe('user');
  });

  it('rejects an empty message (422)', async () => {
    const conv = (await startConversation()).body.data.conversation;
    const res = await request(app)
      .post(`/api/chat/conversations/${conv._id}/messages`)
      .send({ sessionId: SESSION, text: '' });
    expect(res.status).toBe(422);
  });

  it('forbids access with the wrong sessionId (403)', async () => {
    const conv = (await startConversation()).body.data.conversation;
    const res = await request(app)
      .get(`/api/chat/conversations/${conv._id}/messages?sessionId=wrong-session`);
    expect(res.status).toBe(403);
  });

  it('polls only messages newer than `since`', async () => {
    const conv = (await startConversation()).body.data.conversation;
    await request(app).post(`/api/chat/conversations/${conv._id}/messages`).send({ sessionId: SESSION, text: 'first' });
    const all = await request(app).get(`/api/chat/conversations/${conv._id}/messages?sessionId=${SESSION}`);
    expect(all.body.data.messages.length).toBe(1);
    const since = new Date().toISOString();
    const after = await request(app).get(`/api/chat/conversations/${conv._id}/messages?sessionId=${SESSION}&since=${since}`);
    expect(after.body.data.messages.length).toBe(0);
  });
});

describe('admin chat', () => {
  beforeEach(loginAdmin);

  it('requires auth for the inbox (401)', async () => {
    const res = await request(app).get('/api/chat/admin/conversations');
    expect(res.status).toBe(401);
  });

  it('lists conversations and shows unread count', async () => {
    const conv = (await startConversation()).body.data.conversation;
    await request(app).post(`/api/chat/conversations/${conv._id}/messages`).send({ sessionId: SESSION, text: 'hi' });

    const list = await request(app).get('/api/chat/admin/conversations').set('Cookie', adminCookie);
    expect(list.status).toBe(200);
    expect(list.body.count).toBe(1);

    const unread = await request(app).get('/api/chat/admin/unread-count').set('Cookie', adminCookie);
    expect(unread.body.data.count).toBe(1);
  });

  it('lets the chemist reply and flips status to human_active', async () => {
    const conv = (await startConversation()).body.data.conversation;
    await request(app).post(`/api/chat/conversations/${conv._id}/messages`).send({ sessionId: SESSION, text: 'hi' });

    const reply = await request(app)
      .post(`/api/chat/admin/conversations/${conv._id}/messages`)
      .set('Cookie', adminCookie)
      .send({ text: 'Yes, in stock!' });
    expect(reply.status).toBe(201);
    expect(reply.body.data.sender).toBe('admin');

    const thread = await request(app).get(`/api/chat/admin/conversations/${conv._id}`).set('Cookie', adminCookie);
    expect(thread.body.data.conversation.status).toBe('human_active');

    // customer now sees the admin reply
    const poll = await request(app).get(`/api/chat/conversations/${conv._id}/messages?sessionId=${SESSION}`);
    expect(poll.body.data.messages.some(m => m.sender === 'admin')).toBe(true);
  });

  it('resolves a conversation', async () => {
    const conv = (await startConversation()).body.data.conversation;
    const res = await request(app)
      .put(`/api/chat/admin/conversations/${conv._id}/status`)
      .set('Cookie', adminCookie)
      .send({ status: 'resolved' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('resolved');
  });
});
