const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');
const Medicine = require('../models/Medicine');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');

beforeAll(() => db.connect());
afterEach(() => db.clear());
afterAll(() => db.disconnect());

const VALID_USER = {
  name: 'Reviewer',
  email: 'reviewer@example.com',
  password: 'password123',
  phone: '9111111111',
};

let authCookie;
let medicineId;
let userId;

beforeEach(async () => {
  const res = await request(app).post('/api/auth/register').send(VALID_USER);
  authCookie = res.headers['set-cookie'];
  userId = res.body.user.id;

  const cat = await Category.create({ name: 'Vitamins' });
  const med = await Medicine.create({
    name: 'Vitamin C',
    genericName: 'Ascorbic Acid',
    price: 30,
    mrp: 40,
    stock: 200,
    category: cat._id,
  });
  medicineId = med._id.toString();

  // Create a Delivered order so the purchase-verification check passes
  await Order.create({
    user: userId,
    items: [{ medicine: med._id, name: med.name, price: 30, quantity: 1 }],
    totalAmount: 30,
    status: 'Delivered',
    paymentStatus: 'Paid',
    shippingAddress: { name: 'Test', street: '1 St', city: 'City', state: 'ST', zip: '000000', phone: '9000000000' },
  });
});

describe('POST /api/reviews', () => {
  it('creates a review for authenticated user', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: medicineId, rating: 5, comment: 'Great product!' });
    expect(res.status).toBe(201);
    expect(res.body.data.rating).toBe(5);
  });

  it('rejects unauthenticated review with 401', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ medicine: medicineId, rating: 4 });
    expect(res.status).toBe(401);
  });

  it('rejects rating out of range (422)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: medicineId, rating: 6 });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('rating');
  });

  it('rejects rating of 0 (422)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: medicineId, rating: 0 });
    expect(res.status).toBe(422);
  });

  it('rejects invalid medicine ID (422)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: 'bad-id', rating: 4 });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('medicine');
  });

  it('rejects missing medicine (422)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ rating: 3 });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/reviews/medicine/:medicineId', () => {
  it('returns approved reviews for a medicine', async () => {
    const res = await request(app).get(`/api/reviews/medicine/${medicineId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns 400 for invalid medicine ID', async () => {
    const res = await request(app).get('/api/reviews/medicine/bad-id');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/reviews/my-reviews', () => {
  it('returns the logged-in user\'s reviews including pending ones', async () => {
    // Submit a review (created as pending) — should NOT show on the public
    // medicine endpoint, but SHOULD show here for the owner.
    await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: medicineId, rating: 5, comment: 'Pending review' });

    const res = await request(app)
      .get('/api/reviews/my-reviews')
      .set('Cookie', authCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe('pending');
    expect(res.body.data[0].medicine).toHaveProperty('name');
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/reviews/my-reviews');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/reviews/:id/status', () => {
  it('returns 403 for non-admin user', async () => {
    const createRes = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: medicineId, rating: 4 });
    const reviewId = createRes.body.data._id;

    const res = await request(app)
      .put(`/api/reviews/${reviewId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'approved' });
    expect(res.status).toBe(403);
  });

  it('rejects invalid status value (422)', async () => {
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

    const createRes = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: medicineId, rating: 4 });
    const reviewId = createRes.body.data._id;

    const res = await request(app)
      .put(`/api/reviews/${reviewId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'not-a-valid-status' });
    expect(res.status).toBe(422);
  });

  it('approves a review as superadmin', async () => {
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

    const createRes = await request(app)
      .post('/api/reviews')
      .set('Cookie', authCookie)
      .send({ medicine: medicineId, rating: 4 });
    const reviewId = createRes.body.data._id;

    const res = await request(app)
      .put(`/api/reviews/${reviewId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'approved' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('approved');
  });
});
