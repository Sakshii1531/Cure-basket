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

const validBlog = () => ({
  title: 'Test Blog Post',
  sections: [
    { title: 'Introduction', content: 'This is the blog content for testing purposes.' },
  ],
});

beforeEach(login);

describe('GET /api/blogs', () => {
  it('returns blog list publicly', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/blogs', () => {
  it('creates blog as admin', async () => {
    await elevate();
    const res = await request(app)
      .post('/api/blogs')
      .set('Cookie', authCookie)
      .send(validBlog());
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Test Blog Post');
  });

  it('rejects unauthenticated create with 401', async () => {
    const res = await request(app).post('/api/blogs').send(validBlog());
    expect(res.status).toBe(401);
  });

  it('rejects missing title (422)', async () => {
    await elevate();
    const { title, ...noTitle } = validBlog();
    const res = await request(app)
      .post('/api/blogs')
      .set('Cookie', authCookie)
      .send(noTitle);
    expect(res.status).toBe(422);
  });

  it('rejects missing sections (422)', async () => {
    await elevate();
    const { sections, ...noSections } = validBlog();
    const res = await request(app)
      .post('/api/blogs')
      .set('Cookie', authCookie)
      .send(noSections);
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/blogs/:id', () => {
  it('updates a blog as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/blogs')
      .set('Cookie', authCookie)
      .send(validBlog());
    const id = create.body.data._id;

    const res = await request(app)
      .put(`/api/blogs/${id}`)
      .set('Cookie', authCookie)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
  });
});

describe('DELETE /api/blogs/:id', () => {
  it('deletes a blog as admin', async () => {
    await elevate();
    const create = await request(app)
      .post('/api/blogs')
      .set('Cookie', authCookie)
      .send(validBlog());
    const id = create.body.data._id;

    const res = await request(app)
      .delete(`/api/blogs/${id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    await elevate();
    const res = await request(app)
      .delete('/api/blogs/507f1f77bcf86cd799439011')
      .set('Cookie', authCookie);
    expect(res.status).toBe(404);
  });
});
