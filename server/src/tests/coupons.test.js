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

const validCoupon = () => ({
  code: 'SAVE10',
  discountType: 'percent',
  value: 10,
});

beforeEach(login);

describe('POST /api/coupons', () => {
  it('creates coupon as admin', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/coupons')
      .set('Cookie', authCookie)
      .send(validCoupon());
    expect(res.status).toBe(201);
    expect(res.body.data.code).toBe('SAVE10');
  });

  it('rejects unauthenticated create with 401', async () => {
    const res = await request(app).post('/api/coupons').send(validCoupon());
    expect(res.status).toBe(401);
  });

  it('rejects missing code (422)', async () => {
    await elevate();
    const { code, ...noCode } = validCoupon();
    const res = await request(app)
      .post('/api/coupons')
      .set('Cookie', authCookie)
      .send(noCode);
    expect(res.status).toBe(422);
  });

  it('rejects invalid discountType (422)', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/coupons')
      .set('Cookie', authCookie)
      .send({ ...validCoupon(), discountType: 'invalid' });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/coupons', () => {
  it('returns coupon list as admin', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/coupons')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('rejects unauthenticated list with 401', async () => {
    const res = await request(app).get('/api/coupons');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/coupons/validate', () => {
  it('validates a coupon code and returns discount', async () => {
    await elevate();
    await request(app)
      .post('/api/coupons')
      .set('Cookie', authCookie)
      .send(validCoupon());

    const res = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'SAVE10', orderTotal: 500 });
    expect(res.status).toBe(200);
    expect(res.body.data.discount).toBeDefined();
    expect(res.body.data.finalTotal).toBe(450);
  });

  it('returns 404 for unknown coupon', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'NOSUCHCODE', orderTotal: 500 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/coupons/:id', () => {
  it('deletes a coupon as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/coupons')
      .set('Cookie', authCookie)
      .send(validCoupon());
    const id = create.body.data._id;

    const res = await request(app)
      .delete(`/api/coupons/${id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });
});
