const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');
const Medicine = require('../models/Medicine');
const Category = require('../models/Category');
const User = require('../models/User');

beforeAll(() => db.connect());
afterEach(() => db.clear());
afterAll(() => db.disconnect());

let authCookie;
let medicineId;

const VALID_USER = {
  name: 'Order User',
  email: 'order@example.com',
  password: 'password123',
  phone: '9876543210',
};

beforeEach(async () => {
  const res = await request(app).post('/api/auth/register').send(VALID_USER);
  authCookie = res.headers['set-cookie'];

  const cat = await Category.create({ name: 'Antibiotics' });
  const med = await Medicine.create({
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    price: 120,
    mrp: 150,
    stock: 50,
    category: cat._id,
  });
  medicineId = med._id.toString();
});

const validOrder = () => ({
  items: [{ medicine: medicineId, quantity: 2, name: 'Amoxicillin', price: 120 }],
  totalAmount: 240,
  shippingAddress: { name: 'Test User', street: '123 Main St', city: 'Delhi', phone: '9876543210' },
});

describe('POST /api/orders', () => {
  it('creates an order for authenticated user', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send(validOrder());
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAmount).toBe(240);
  });

  it('rejects unauthenticated request with 401', async () => {
    const res = await request(app).post('/api/orders').send(validOrder());
    expect(res.status).toBe(401);
  });

  it('rejects empty items array (422)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send({ ...validOrder(), items: [] });
    expect(res.status).toBe(422);
  });

  it('rejects missing totalAmount (422)', async () => {
    const { totalAmount, ...noTotal } = validOrder();
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send(noTotal);
    expect(res.status).toBe(422);
  });

  it('rejects invalid medicine ObjectId in items (422)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send({ ...validOrder(), items: [{ medicine: 'bad-id', quantity: 1 }] });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/orders/my-orders', () => {
  it('returns user orders', async () => {
    await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send(validOrder());

    const res = await request(app)
      .get('/api/orders/my-orders')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/orders/my-orders');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/orders/:id/status', () => {
  it('returns 403 for non-admin user', async () => {
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send(validOrder());
    const orderId = orderRes.body.data._id;

    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'Shipped' });
    expect(res.status).toBe(403);
  });

  it('updates status when called as superadmin', async () => {
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send(validOrder());
    const orderId = orderRes.body.data._id;

    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'Shipped' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Shipped');
  });

  it('rejects invalid status value (422)', async () => {
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Cookie', authCookie)
      .send(validOrder());
    const orderId = orderRes.body.data._id;

    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Cookie', authCookie)
      .send({ status: 'Flying' });
    expect(res.status).toBe(422);
  });

  it('returns 404 for malformed order id', async () => {
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });
    const res = await request(app)
      .put('/api/orders/bad-id/status')
      .set('Cookie', authCookie)
      .send({ status: 'Shipped' });
    expect(res.status).toBe(404);
  });
});
