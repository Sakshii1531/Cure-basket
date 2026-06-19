const request = require('supertest');
const app = require('./helpers/app');
const db = require('./helpers/db');
const User = require('../models/User');
const Role = require('../models/Role');

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

describe('Granular Admin Role Permissions (RBAC)', () => {
  let readRoleDoc;
  let writeRoleDoc;
  let noRolesRoleDoc;

  beforeEach(async () => {
    // Create Roles in DB
    readRoleDoc = await Role.create({
      name: 'Roles Reader',
      permissions: [{ module: 'roles', actions: ['read'] }],
    });

    writeRoleDoc = await Role.create({
      name: 'Roles Manager',
      permissions: [{ module: 'roles', actions: ['read', 'write', 'delete'] }],
    });

    noRolesRoleDoc = await Role.create({
      name: 'Medicines Operator',
      permissions: [{ module: 'medicines', actions: ['read', 'write'] }],
    });
  });

  const makeAdminWithRole = async (roleId) => {
    await User.updateOne(
      { email: VALID_USER.email },
      { role: 'admin', customRole: roleId }
    );
  };

  it('allows GET /api/roles for admin with read permission', async () => {
    await makeAdminWithRole(readRoleDoc._id);
    const res = await request(app)
      .get('/api/roles')
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects GET /api/roles for admin without read permission', async () => {
    await makeAdminWithRole(noRolesRoleDoc._id);
    const res = await request(app)
      .get('/api/roles')
      .set('Cookie', authCookie);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('allows POST /api/roles for admin with write permission', async () => {
    await makeAdminWithRole(writeRoleDoc._id);
    const res = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send({
        name: 'New Custom Tester Role',
        permissions: [{ module: 'banners', actions: ['read'] }]
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('rejects POST /api/roles for admin without write permission', async () => {
    await makeAdminWithRole(readRoleDoc._id);
    const res = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send({
        name: 'Should Fail Role',
        permissions: [{ module: 'banners', actions: ['read'] }]
      });
    expect(res.status).toBe(403);
  });

  it('allows DELETE /api/roles/:id for admin with delete permission', async () => {
    await makeAdminWithRole(writeRoleDoc._id);
    const tempRole = await Role.create({
      name: 'Temp Role to Delete',
      permissions: []
    });
    const res = await request(app)
      .delete(`/api/roles/${tempRole._id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects DELETE /api/roles/:id for admin without delete permission', async () => {
    await makeAdminWithRole(readRoleDoc._id);
    const tempRole = await Role.create({
      name: 'Temp Role to Protect',
      permissions: []
    });
    const res = await request(app)
      .delete(`/api/roles/${tempRole._id}`)
      .set('Cookie', authCookie);
    expect(res.status).toBe(403);
  });
});

describe('Role Credentials Sync with User Collection', () => {
  beforeEach(async () => {
    await elevate();
  });

  it('automatically creates a User document when a Role is created with email and password', async () => {
    const rolePayload = {
      name: 'Chemist Role',
      email: 'chemist@example.com',
      password: 'password123',
      permissions: [{ module: 'medicines', actions: ['read', 'write'] }]
    };

    const res = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(rolePayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const createdRole = res.body.data;
    expect(createdRole.email).toBe('chemist@example.com');

    // Check if the user is created in database
    const user = await User.findOne({ email: 'chemist@example.com' });
    expect(user).toBeTruthy();
    expect(user.name).toBe('Chemist Role');
    expect(user.role).toBe('admin');
    expect(user.customRole.toString()).toBe(createdRole._id.toString());
  });

  it('automatically updates the User document when the Role email/name is updated', async () => {
    const rolePayload = {
      name: 'Chemist Role 2',
      email: 'chemist2@example.com',
      password: 'password123',
      permissions: []
    };

    const createRes = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(rolePayload);
    
    const roleId = createRes.body.data._id;

    // Update Role name and email
    const updateRes = await request(app)
      .put(`/api/roles/${roleId}`)
      .set('Cookie', authCookie)
      .send({
        name: 'Senior Chemist Role',
        email: 'srchemist@example.com'
      });

    expect(updateRes.status).toBe(200);

    // Old user should not exist under old email
    const oldUser = await User.findOne({ email: 'chemist2@example.com' });
    expect(oldUser).toBeNull();

    // New user should exist with new email and new name
    const newUser = await User.findOne({ email: 'srchemist@example.com' });
    expect(newUser).toBeTruthy();
    expect(newUser.name).toBe('Senior Chemist Role');
    expect(newUser.customRole.toString()).toBe(roleId);
  });

  it('automatically deletes the User document when the Role is deleted', async () => {
    const rolePayload = {
      name: 'Temp Doctor',
      email: 'doctor@example.com',
      password: 'password123',
      permissions: []
    };

    const createRes = await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(rolePayload);
    
    const roleId = createRes.body.data._id;

    // Verify user exists
    let user = await User.findOne({ email: 'doctor@example.com' });
    expect(user).toBeTruthy();

    // Delete role
    const deleteRes = await request(app)
      .delete(`/api/roles/${roleId}`)
      .set('Cookie', authCookie);
    
    expect(deleteRes.status).toBe(200);

    // Verify user is deleted
    user = await User.findOne({ email: 'doctor@example.com' });
    expect(user).toBeNull();
  });

  it('allows the created user to login successfully via /api/auth/login', async () => {
    const rolePayload = {
      name: 'Chemist Login Test',
      email: 'chemistlogintest@example.com',
      password: 'password123',
      permissions: [{ module: 'medicines', actions: ['read'] }]
    };

    // Create the role
    await request(app)
      .post('/api/roles')
      .set('Cookie', authCookie)
      .send(rolePayload);

    // Try to login with the created credentials
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'chemistlogintest@example.com',
        password: 'password123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.user.role).toBe('admin');
    expect(loginRes.body.user.name).toBe('Chemist Login Test');
    expect(loginRes.body.user.customRole).toBeTruthy();
  });

  it('enforces chat read and write permissions on admin chat endpoints', async () => {
    // 1. Create a role without chat permissions
    const noChatRole = await Role.create({
      name: 'No Chat Allowed',
      permissions: []
    });

    // 2. Create a role with chat read and write permissions
    const chatRole = await Role.create({
      name: 'Chat Operator',
      permissions: [
        { module: 'chat', actions: ['read', 'write'] }
      ]
    });

    // 3. User with no chat permissions
    await User.updateOne({ email: VALID_USER.email }, { role: 'admin', customRole: noChatRole._id });
    
    // Request conversations
    let chatRes = await request(app)
      .get('/api/chat/admin/conversations')
      .set('Cookie', authCookie);
    expect(chatRes.status).toBe(403); // Forbidden

    // 4. User with chat permissions
    await User.updateOne({ email: VALID_USER.email }, { role: 'admin', customRole: chatRole._id });
    
    chatRes = await request(app)
      .get('/api/chat/admin/conversations')
      .set('Cookie', authCookie);
    expect(chatRes.status).toBe(200); // Success
  });
});



