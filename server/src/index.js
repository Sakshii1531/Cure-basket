const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const medicines = require('./routes/medicineRoutes');
const categories = require('./routes/categoryRoutes');
const brands = require('./routes/brandRoutes');
const orders = require('./routes/orderRoutes');
const prescriptions = require('./routes/prescriptionRoutes');

const app = express();

// Body parser
app.use(express.json());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/medicines', medicines);
app.use('/api/categories', categories);
app.use('/api/brands', brands);
app.use('/api/orders', orders);
app.use('/api/prescriptions', prescriptions);

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
