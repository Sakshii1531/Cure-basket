const User = require('../models/User');

const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    console.log('Seed: SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set, skipping.');
    return;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Seed: Super admin already exists, skipping.');
    return;
  }

  await User.create({
    name,
    email,
    password,
    phone: '0000000000',
    role: 'superadmin',
  });

  console.log(`Seed: Super admin created → ${email}`);
};

module.exports = seedSuperAdmin;
