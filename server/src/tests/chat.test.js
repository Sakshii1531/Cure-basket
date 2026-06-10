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

  it('captures a guest name/email from a later start (offline form)', async () => {
    // First open creates an anonymous conversation (empty identity)…
    await request(app).post('/api/chat/conversations').send({ sessionId: 'guest-1' });
    // …then the offline "Leave a Message" form submits name + email.
    const res = await request(app)
      .post('/api/chat/conversations')
      .send({ sessionId: 'guest-1', name: 'Jane Guest', email: 'jane@example.com' });
    expect(res.body.data.conversation.customer.name).toBe('Jane Guest');
    expect(res.body.data.conversation.customer.email).toBe('jane@example.com');
  });

  it('reports live customer presence (customerOnline)', async () => {
    const res = await startConversation();
    expect(res.body.data.conversation.customerOnline).toBe(true);
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

  it('marks the customer Away once they stop polling (closed tab)', async () => {
    const Conversation = require('../models/Conversation');
    const conv = (await startConversation()).body.data.conversation;
    expect(conv.customerOnline).toBe(true);

    // Simulate the tab being closed: lastUserSeenAt goes stale (no more polls).
    await Conversation.updateOne({ _id: conv._id }, { lastUserSeenAt: new Date(Date.now() - 60000) });

    const view = await request(app).get(`/api/chat/admin/conversations/${conv._id}`).set('Cookie', adminCookie);
    expect(view.body.data.conversation.customerOnline).toBe(false);
  });
});

describe('AI assistant (generateBotReply)', () => {
  const { generateBotReply } = require('../services/chatBot');
  const Category = require('../models/Category');
  const Medicine = require('../models/Medicine');

  it('escalates when the visitor asks for a human', async () => {
    const r = await generateBotReply('can I talk to a person please');
    expect(r.escalate).toBe(true);
  });

  it('refuses medical advice and escalates', async () => {
    const r = await generateBotReply('what should I take for a headache?');
    expect(r.escalate).toBe(true);
    expect(r.text.toLowerCase()).toMatch(/advice|doctor|pharmacist/);
  });

  it('answers the prescription FAQ without escalating', async () => {
    const r = await generateBotReply('how do I upload my prescription?');
    expect(r.escalate).toBe(false);
    expect(r.text).toMatch(/Upload Rx/i);
  });

  it('greets without escalating', async () => {
    const r = await generateBotReply('hi');
    expect(r.escalate).toBe(false);
  });

  it('explains the ordering flow step by step without escalating', async () => {
    const r = await generateBotReply('I want to order from your website');
    expect(r.escalate).toBe(false);
    expect(r.text).toMatch(/Add to Cart/i);
    expect(r.text).toMatch(/Checkout/i);
    expect(r.text).toMatch(/1️⃣/);
  });

  it('answers product availability from the live catalog', async () => {
    const cat = await Category.create({ name: 'Pain Relief' });
    await Medicine.create({ title: 'Paracetamol 500mg', category: cat._id, pricePerUnit: 2, totalPrice: 20, status: 'Active' });
    const r = await generateBotReply('do you have Paracetamol?');
    expect(r.escalate).toBe(false);
    expect(r.text).toMatch(/Paracetamol/i);
  });

  it('handles a no-match availability query gracefully (no escalation)', async () => {
    const r = await generateBotReply('do you have zzzznotarealdrug?');
    expect(r.escalate).toBe(false);
    expect(r.text.toLowerCase()).toMatch(/couldn.t find|search the site/);
  });

  it('escalates ambiguous messages when no LLM key is configured', async () => {
    const r = await generateBotReply('tell me a fun fact about space');
    expect(r.escalate).toBe(true);
  });
});

describe('chatbot clarification loop & connection prompt', () => {
  const chatBot = require('../services/chatBot');
  const Conversation = require('../models/Conversation');
  const Message = require('../models/Message');

  it('clarifies twice before connection prompt and handles user response', async () => {
    const res = await startConversation();
    const conv = res.body.data.conversation;

    // Message 1: First gibberish
    await request(app)
      .post(`/api/chat/conversations/${conv._id}/messages`)
      .send({ sessionId: SESSION, text: 'qwerqwer' });
    await chatBot.respond(conv._id);

    let dbConv = await Conversation.findById(conv._id);
    expect(dbConv.clarificationCount).toBe(1);
    expect(dbConv.status).toBe('bot');

    let botMsgs = await Message.find({ conversation: conv._id, sender: 'bot' }).sort('createdAt');
    expect(botMsgs.length).toBe(1);
    expect(botMsgs[0].text).toContain("rephrase or clarify");

    // Message 2: Second gibberish
    await request(app)
      .post(`/api/chat/conversations/${conv._id}/messages`)
      .send({ sessionId: SESSION, text: 'asdfasdf' });
    await chatBot.respond(conv._id);

    dbConv = await Conversation.findById(conv._id);
    expect(dbConv.clarificationCount).toBe(2);
    expect(dbConv.status).toBe('bot');

    botMsgs = await Message.find({ conversation: conv._id, sender: 'bot' }).sort('createdAt');
    expect(botMsgs.length).toBe(2);
    expect(botMsgs[1].text).toContain("connect you to an executive");

    // Message 3: Confirm connection
    await request(app)
      .post(`/api/chat/conversations/${conv._id}/messages`)
      .send({ sessionId: SESSION, text: 'yes please' });
    await chatBot.respond(conv._id);

    dbConv = await Conversation.findById(conv._id);
    expect(dbConv.clarificationCount).toBe(0);
    expect(dbConv.status).toBe('waiting_human');

    const lastMsg = await Message.findOne({ conversation: conv._id }).sort('-createdAt');
    expect(lastMsg.sender).toBe('system');
    expect(lastMsg.text).toContain("Connecting you with a member of our team");
  });
  
  it('resets clarificationCount when a query is successfully matched', async () => {
    const res = await startConversation();
    const conv = res.body.data.conversation;

    await request(app)
      .post(`/api/chat/conversations/${conv._id}/messages`)
      .send({ sessionId: SESSION, text: 'qwerqwer' });
    await chatBot.respond(conv._id);

    let dbConv = await Conversation.findById(conv._id);
    expect(dbConv.clarificationCount).toBe(1);

    await request(app)
      .post(`/api/chat/conversations/${conv._id}/messages`)
      .send({ sessionId: SESSION, text: 'how do I upload my prescription?' });
    await chatBot.respond(conv._id);

    dbConv = await Conversation.findById(conv._id);
    expect(dbConv.clarificationCount).toBe(0);
  });
});
