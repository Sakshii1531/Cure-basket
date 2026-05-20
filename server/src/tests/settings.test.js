const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');
const User = require('../models/User');

beforeAll(() => db.connect());
afterEach(() => db.clear());
afterAll(() => db.disconnect());

const VALID_USER = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123',
};

let authCookie;

const login = async () => {
  const res = await request(app).post('/api/auth/register').send(VALID_USER);
  authCookie = res.headers['set-cookie'];
};

const elevate = () => User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

beforeEach(login);

describe('GET /api/settings/:type', () => {
  it('returns settings for valid type as admin', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/settings/bank_contact')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns settings for cms type', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/settings/cms')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });

  it('returns settings for general type', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/settings/general')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });

  it('rejects unknown type with 400', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/settings/unknown_type')
      .set('Cookie', authCookie);
    expect(res.status).toBe(400);
  });

  it('rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/settings/bank_contact');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/settings/:type', () => {
  it('updates settings for valid type as admin', async () => {
    await elevate();
    const res = await request(app)
      .put('/api/settings/bank_contact')
      .set('Cookie', authCookie)
      .send({ bankName: 'Test Bank', accountNumber: '123456789' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects unknown type with 400', async () => {
    await elevate();
    const res = await request(app)
      .put('/api/settings/bad_type')
      .set('Cookie', authCookie)
      .send({ foo: 'bar' });
    expect(res.status).toBe(400);
  });

  it('rejects unauthenticated update with 401', async () => {
    const res = await request(app)
      .put('/api/settings/bank_contact')
      .send({ bankName: 'Test' });
    expect(res.status).toBe(401);
  });

  it('rejects non-admin update with 403', async () => {
    const res = await request(app)
      .put('/api/settings/bank_contact')
      .set('Cookie', authCookie)
      .send({ bankName: 'Test' });
    expect(res.status).toBe(403);
  });
});
