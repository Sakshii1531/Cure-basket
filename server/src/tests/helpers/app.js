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

const auth = require('../../routes/authRoutes');
const medicines = require('../../routes/medicineRoutes');
const orders = require('../../routes/orderRoutes');
const reviews = require('../../routes/reviewRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/medicines', medicines);
app.use('/api/orders', orders);
app.use('/api/reviews', reviews);

module.exports = app;
