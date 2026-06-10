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
  title: 'Paracetamol 500mg',
  genericFor: 'Paracetamol',
  pricePerUnit: 50,
  totalPrice: 50,
  packSize: '10 Tablets',
  quantityOptions: [1],
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

  it('filters by search query q (fuzzy matching)', async () => {
    const Medicine = require('../models/Medicine');
    await Medicine.create({
      title: 'Aspirin 100mg',
      genericFor: 'Aspirin',
      pricePerUnit: 10,
      totalPrice: 10,
      packSize: '10 Tablets',
      quantityOptions: [1],
      category: categoryId,
    });
    await Medicine.create({
      title: 'Ibuprofen 200mg',
      genericFor: 'Ibuprofen',
      pricePerUnit: 12,
      totalPrice: 12,
      packSize: '10 Tablets',
      quantityOptions: [1],
      category: categoryId,
    });

    // Test case 1: spacing variation (100mg query on "Aspirin 100mg" or searching "100 mg")
    const resSpacing = await request(app).get('/api/medicines?q=100%20mg');
    expect(resSpacing.status).toBe(200);
    expect(resSpacing.body.data.length).toBe(1);
    expect(resSpacing.body.data[0].title).toBe('Aspirin 100mg');

    // Test case 2: order-independent multi-token search
    const resOrder = await request(app).get('/api/medicines?q=100mg%20Aspirin');
    expect(resOrder.status).toBe(200);
    expect(resOrder.body.data.length).toBe(1);
    expect(resOrder.body.data[0].title).toBe('Aspirin 100mg');
  });

  it('filters by search query name[regex]', async () => {
    const Medicine = require('../models/Medicine');
    await Medicine.create({
      title: 'Aspirin 100mg',
      genericFor: 'Aspirin',
      pricePerUnit: 10,
      totalPrice: 10,
      packSize: '10 Tablets',
      quantityOptions: [1],
      category: categoryId,
    });

    const res = await request(app).get('/api/medicines?name[regex]=Aspirin');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Aspirin 100mg');
  });

  it('tracks search query when search parameter is provided', async () => {
    const SearchQuery = require('../models/SearchQuery');
    
    // Perform search
    await request(app).get('/api/medicines?q=Aspirin');
    
    // Wait slightly for async findOneAndUpdate or check the db
    const queryDoc = await SearchQuery.findOne({ query: 'aspirin' });
    expect(queryDoc).not.toBeNull();
    expect(queryDoc.count).toBe(1);
    expect(queryDoc.originalQuery).toBe('Aspirin');
  });
});

describe('GET /api/medicines/popular-searches', () => {
  it('returns list of popular searches', async () => {
    const SearchQuery = require('../models/SearchQuery');
    await SearchQuery.create({ query: 'paracetamol', originalQuery: 'Paracetamol', count: 15 });
    await SearchQuery.create({ query: 'wegovy', originalQuery: 'Wegovy', count: 25 });

    const res = await request(app).get('/api/medicines/popular-searches');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(['Wegovy', 'Paracetamol']);
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

  it('rejects missing title (422)', async () => {
    const User = require('../models/User');
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

    const { title, ...noTitle } = validMedicine();
    const res = await request(app)
      .post('/api/medicines')
      .set('Cookie', authCookie)
      .send(noTitle);
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('title');
  });

  it('rejects negative price (422)', async () => {
    const User = require('../models/User');
    await User.updateOne({ email: VALID_USER.email }, { role: 'superadmin' });

    const res = await request(app)
      .post('/api/medicines')
      .set('Cookie', authCookie)
      .send({ ...validMedicine(), pricePerUnit: -10 });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('pricePerUnit');
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
