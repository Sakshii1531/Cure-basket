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

describe('GET /api/analytics/summary', () => {
  it('returns summary data for admin', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/analytics/summary')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.orders).toBeDefined();
    expect(res.body.data.revenue).toBeDefined();
    expect(res.body.data.users).toBeDefined();
    expect(res.body.data.medicines).toBeDefined();
  });

  it('rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/analytics/summary');
    expect(res.status).toBe(401);
  });

  it('rejects non-admin with 403', async () => {
    const res = await request(app)
      .get('/api/analytics/summary')
      .set('Cookie', authCookie);
    expect(res.status).toBe(403);
  });
});

describe('GET /api/analytics/revenue', () => {
  it('returns revenue chart data for superadmin', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/analytics/revenue')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('supports months query param', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/analytics/revenue?months=3')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });

  it('rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/analytics/revenue');
    expect(res.status).toBe(401);
  });

  it('rejects admin without analytics:read permission with 403', async () => {
    await User.updateOne({ email: VALID_USER.email }, { role: 'admin' });
    const res = await request(app)
      .get('/api/analytics/revenue')
      .set('Cookie', authCookie);
    expect(res.status).toBe(403);
  });
});
