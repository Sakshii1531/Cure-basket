const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');
const Category = require('../models/Category');

beforeAll(() => db.connect());
afterEach(() => db.clear());
afterAll(() => db.disconnect());

const VALID_USER = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123',
  phone: '9999999999',
};

let authCookie;
let categoryId;

const login = async () => {
  const res = await request(app).post('/api/auth/register').send(VALID_USER);
  authCookie = res.headers['set-cookie'];
};

const validMedicine = () => ({
  name: 'Paracetamol 500mg',
  genericName: 'Paracetamol',
  price: 50,
  mrp: 60,
  stock: 100,
  category: categoryId,
});

beforeEach(async () => {
  await login();
  const cat = await Category.create({ name: 'Pain Relief' });
  categoryId = cat._id.toString();
});

describe('GET /api/medicines', () => {
  it('returns paginated medicine list', async () => {
    const res = await request(app).get('/api/medicines');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('supports pagination params', async () => {
    const res = await request(app).get('/api/medicines?page=1&limit=5');
    expect(res.status).toBe(200);
  });
});

describe('POST /api/medicines', () => {
  it('creates medicine when authenticated as admin', async () => {
    // Promote to superadmin directly on the model to bypass auth route
    const User = require('../models/User');
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

    const res = await request(app)
      .post('/api/medicines')
      .set('Cookie', authCookie)
      .send(validMedicine());
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Paracetamol 500mg');
  });

  it('rejects unauthenticated create with 401', async () => {
    const res = await request(app).post('/api/medicines').send(validMedicine());
    expect(res.status).toBe(401);
  });

  it('rejects missing name (422)', async () => {
    const User = require('../models/User');
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

    const { name, ...noName } = validMedicine();
    const res = await request(app)
      .post('/api/medicines')
      .set('Cookie', authCookie)
      .send(noName);
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('name');
  });

  it('rejects negative price (422)', async () => {
    const User = require('../models/User');
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

    const res = await request(app)
      .post('/api/medicines')
      .set('Cookie', authCookie)
      .send({ ...validMedicine(), price: -10 });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('price');
  });
});

describe('GET /api/medicines/:id', () => {
  it('returns 404 for malformed id', async () => {
    const res = await request(app).get('/api/medicines/not-an-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for unknown valid ObjectId', async () => {
    const res = await request(app).get('/api/medicines/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });
});
