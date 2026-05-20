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

const validBanner = () => ({
  title: 'Summer Sale',
  image: 'https://example.com/banner.jpg',
  position: 'main',
});

beforeEach(login);

describe('GET /api/banners', () => {
  it('returns banner list publicly', async () => {
    const res = await request(app).get('/api/banners');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('filters by position param', async () => {
    await elevate();
    await request(app)
      .post('/api/banners')
      .set('Cookie', authCookie)
      .send(validBanner());

    const res = await request(app).get('/api/banners?position=main');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('POST /api/banners', () => {
  it('creates banner as admin', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/banners')
      .set('Cookie', authCookie)
      .send(validBanner());
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Summer Sale');
  });

  it('rejects unauthenticated create with 401', async () => {
    const res = await request(app).post('/api/banners').send(validBanner());
    expect(res.status).toBe(401);
  });

  it('rejects missing title (422)', async () => {
    await elevate();
    const { title, ...noTitle } = validBanner();
    const res = await request(app)
      .post('/api/banners')
      .set('Cookie', authCookie)
      .send(noTitle);
    expect(res.status).toBe(422);
  });

  it('rejects missing image (422)', async () => {
    await elevate();
    const { image, ...noImage } = validBanner();
    const res = await request(app)
      .post('/api/banners')
      .set('Cookie', authCookie)
      .send(noImage);
    expect(res.status).toBe(422);
  });

  it('rejects invalid position (422)', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/banners')
      .set('Cookie', authCookie)
      .send({ ...validBanner(), position: 'invalid-pos' });
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/banners/:id', () => {
  it('updates a banner as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/banners')
      .set('Cookie', authCookie)
      .send(validBanner());
    const id = create.body.data._id;

    const res = await request(app)
      .put(`/api/banners/${id}`)
      .set('Cookie', authCookie)
      .send({ title: 'Winter Sale', isActive: false });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Winter Sale');
  });
});

describe('DELETE /api/banners/:id', () => {
  it('deletes a banner as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/banners')
      .set('Cookie', authCookie)
      .send(validBanner());
    const id = create.body.data._id;

    const res = await request(app)
      .delete(`/api/banners/${id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });
});
