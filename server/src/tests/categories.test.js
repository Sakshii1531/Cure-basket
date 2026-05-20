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

describe('GET /api/categories', () => {
  it('returns category list publicly', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/categories', () => {
  it('creates category as admin', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', authCookie)
      .send({ name: 'Pain Relief' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Pain Relief');
  });

  it('rejects unauthenticated create with 401', async () => {
    const res = await request(app).post('/api/categories').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  it('rejects missing name (422)', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', authCookie)
      .send({});
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/categories/:id', () => {
  it('updates a category as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/categories')
      .set('Cookie', authCookie)
      .send({ name: 'Old Name' });
    const id = create.body.data._id;

    const res = await request(app)
      .put(`/api/categories/${id}`)
      .set('Cookie', authCookie)
      .send({ name: 'New Name' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('New Name');
  });
});

describe('DELETE /api/categories/:id', () => {
  it('deletes a category as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/categories')
      .set('Cookie', authCookie)
      .send({ name: 'To Delete' });
    const id = create.body.data._id;

    const res = await request(app)
      .delete(`/api/categories/${id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    await elevate();
    const res = await request(app)
      .delete('/api/categories/507f1f77bcf86cd799439011')
      .set('Cookie', authCookie);
    expect(res.status).toBe(404);
  });
});
