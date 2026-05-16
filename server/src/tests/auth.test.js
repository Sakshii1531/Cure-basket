const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');

beforeAll(() => db.connect());
afterEach(() => db.clear());
afterAll(() => db.disconnect());

const VALID_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '9999999999',
};

describe('POST /api/auth/register', () => {
  it('registers a new user and sets cookie', async () => {
    const res = await request(app).post('/api/auth/register').send(VALID_USER);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(VALID_USER.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
    const res = await request(app).post('/api/auth/register').send(VALID_USER);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing name (422)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_USER, name: '' });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('name');
  });

  it('rejects invalid email (422)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_USER, email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('email');
  });

  it('rejects short password (422)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_USER, password: '123' });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('password');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: VALID_USER.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing email (422)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'password123' });
    expect(res.status).toBe(422);
  });

  it('rejects missing password (422)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 without cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns user when authenticated', async () => {
    const loginRes = await request(app)
      .post('/api/auth/register')
      .send(VALID_USER);
    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(VALID_USER.email);
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the auth cookie', async () => {
    const loginRes = await request(app)
      .post('/api/auth/register')
      .send(VALID_USER);
    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
