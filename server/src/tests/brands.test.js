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

describe('GET /api/brands', () => {
  it('returns brand list publicly', async () => {
    const res = await request(app).get('/api/brands');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/brands', () => {
  it('creates brand as admin', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/brands')
      .set('Cookie', authCookie)
      .send({ name: 'Cipla' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Cipla');
  });

  it('rejects unauthenticated create with 401', async () => {
    const res = await request(app).post('/api/brands').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  it('rejects missing name (422)', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/brands')
      .set('Cookie', authCookie)
      .send({});
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/brands/:id', () => {
  it('updates a brand as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/brands')
      .set('Cookie', authCookie)
      .send({ name: 'Old Brand' });
    const id = create.body.data._id;

    const res = await request(app)
      .put(`/api/brands/${id}`)
      .set('Cookie', authCookie)
      .send({ name: 'New Brand' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('New Brand');
  });
});

describe('DELETE /api/brands/:id', () => {
  it('deletes a brand as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/brands')
      .set('Cookie', authCookie)
      .send({ name: 'To Delete' });
    const id = create.body.data._id;

    const res = await request(app)
      .delete(`/api/brands/${id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    await elevate();
    const res = await request(app)
      .delete('/api/brands/507f1f77bcf86cd799439011')
      .set('Cookie', authCookie);
    expect(res.status).toBe(404);
  });
});
