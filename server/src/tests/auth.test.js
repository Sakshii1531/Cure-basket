const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');

// Prevent actual SMTP calls during tests
jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue(true));

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

describe('Account lockout', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
  });

  it('returns remaining attempts message after each failed login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: 'wrong1' });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/attempt/i);
  });

  it('locks account after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: VALID_USER.email, password: 'wrongpass' });
    }
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: VALID_USER.password });
    expect(res.status).toBe(423);
    expect(res.body.error).toMatch(/locked/i);
  });

  it('resets attempts on successful login', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: 'wrong' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: VALID_USER.password });
    expect(res.status).toBe(200);
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('always returns 200 regardless of whether email exists (prevents enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nonexistent@test.com' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 200 for a registered email too', async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: VALID_USER.email });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('PUT /api/auth/reset-password/:token', () => {
  it('returns 400 for an invalid token', async () => {
    const res = await request(app)
      .put('/api/auth/reset-password/invalidtoken123')
      .send({ password: 'newpassword123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('OTP Forgot Password Flow', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(VALID_USER);
  });

  it('fails OTP request if email is missing', async () => {
    const res = await request(app).post('/api/auth/forgot-password-otp').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('handles forgot-password-otp request and verification/reset flow successfully', async () => {
    // 1. Request OTP
    const reqRes = await request(app)
      .post('/api/auth/forgot-password-otp')
      .send({ email: VALID_USER.email });
    expect(reqRes.status).toBe(200);
    expect(reqRes.body.success).toBe(true);

    // Retrieve user directly from DB helper to get the generated OTP
    const User = require('../models/User');
    const userObj = await User.findOne({ email: VALID_USER.email });
    expect(userObj.resetPasswordOTP).toBeDefined();

    // Since we hash the OTP before saving, let's mock/test it by verifying a dummy/invalid OTP first
    const failVerifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: VALID_USER.email, otp: '000000' });
    expect(failVerifyRes.status).toBe(400);
    expect(failVerifyRes.body.success).toBe(false);

    // Since our random OTP isn't exposed except in mock sendEmail call (which is mocked at line 6),
    // let's grab the mock sendEmail calls to read the plain-text OTP!
    const sendEmail = require('../utils/sendEmail');
    expect(sendEmail).toHaveBeenCalled();
    const lastEmailCall = sendEmail.mock.calls[sendEmail.mock.calls.length - 1][0];
    const htmlBody = lastEmailCall.html;
    // Extract 6-digit OTP from html body
    const otpMatch = htmlBody.match(/\b\d{6}\b/);
    expect(otpMatch).not.toBeNull();
    const plainOtp = otpMatch[0];

    // 2. Verify valid OTP
    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: VALID_USER.email, otp: plainOtp });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);

    // 3. Reset password using OTP
    const resetRes = await request(app)
      .post('/api/auth/reset-password-otp')
      .send({ email: VALID_USER.email, otp: plainOtp, password: 'mynewsecurepassword123' });
    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // 4. Try logging in with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: 'mynewsecurepassword123' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
  });
});
