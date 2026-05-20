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

const validRole = () => ({
  name: 'Content Manager',
  permissions: [{ module: 'blogs', actions: ['read', 'write'] }],
});

beforeEach(login);

describe('GET /api/roles', () => {
  it('returns role list as admin', async () => {
    await elevate();
    const res = await request(app)
      .get('/api/roles')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/roles');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/roles', () => {
  it('creates role as superadmin', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(validRole());
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Content Manager');
  });

  it('rejects unauthenticated create with 401', async () => {
    const res = await request(app).post('/api/roles').send(validRole());
    expect(res.status).toBe(401);
  });

  it('rejects missing name (422)', async () => {
    await elevate();
    const { name, ...noName } = validRole();
    const res = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(noName);
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/roles/:id', () => {
  it('updates a role as superadmin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(validRole());
    const id = create.body.data._id;

    const res = await request(app)
      .put(`/api/roles/${id}`)
      .set('Cookie', authCookie)
      .send({ name: 'Senior Content Manager' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Senior Content Manager');
  });
});

describe('DELETE /api/roles/:id', () => {
  it('deletes a role as superadmin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(validRole());
    const id = create.body.data._id;

    const res = await request(app)
      .delete(`/api/roles/${id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    await elevate();
    const res = await request(app)
      .delete('/api/roles/507f1f77bcf86cd799439011')
      .set('Cookie', authCookie);
    expect(res.status).toBe(404);
  });
});
