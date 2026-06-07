// Minimal Express app for integration tests — no DB connect, no server.listen
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.NODE_ENV = 'test';

const express = require('express');
const cookieParser = require('cookie-parser');

// Register all Mongoose models so populate() calls don't throw
require('../../models/User');
require('../../models/Role');
require('../../models/Medicine');
require('../../models/Category');
require('../../models/Brand');
require('../../models/Order');
require('../../models/Review');
require('../../models/Coupon');
require('../../models/Blog');
require('../../models/Banner');
require('../../models/Settings');
require('../../models/Conversation');
require('../../models/Message');

const auth = require('../../routes/authRoutes');
const medicines = require('../../routes/medicineRoutes');
const orders = require('../../routes/orderRoutes');
const reviews = require('../../routes/reviewRoutes');
const categories = require('../../routes/categoryRoutes');
const brands = require('../../routes/brandRoutes');
const coupons = require('../../routes/couponRoutes');
const blogs = require('../../routes/blogRoutes');
const banners = require('../../routes/bannerRoutes');
const roles = require('../../routes/roleRoutes');
const analytics = require('../../routes/analyticsRoutes');
const settings = require('../../routes/settingsRoutes');
const chat = require('../../routes/chatRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/medicines', medicines);
app.use('/api/orders', orders);
app.use('/api/reviews', reviews);
app.use('/api/categories', categories);
app.use('/api/brands', brands);
app.use('/api/coupons', coupons);
app.use('/api/blogs', blogs);
app.use('/api/banners', banners);
app.use('/api/roles', roles);
app.use('/api/analytics', analytics);
app.use('/api/settings', settings);
app.use('/api/chat', chat);

module.exports = app;
