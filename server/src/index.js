const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const seedSuperAdmin = require('./utils/seed');

// Load env vars
dotenv.config();

// Connect to database, then seed super admin
connectDB().then(seedSuperAdmin).catch((err) => console.error('Seed error:', err.message));

// Route files
const auth = require('./routes/authRoutes');
const medicines = require('./routes/medicineRoutes');
const categories = require('./routes/categoryRoutes');
const brands = require('./routes/brandRoutes');
const orders = require('./routes/orderRoutes');
const prescriptions = require('./routes/prescriptionRoutes');
const settings = require('./routes/settingsRoutes');
const roles = require('./routes/roleRoutes');
const blogs = require('./routes/blogRoutes');
const reviews = require('./routes/reviewRoutes');
const coupons = require('./routes/couponRoutes');
const banners = require('./routes/bannerRoutes');
const users = require('./routes/userRoutes');
const analytics = require('./routes/analyticsRoutes');
const uploadRoute = require('./routes/uploadRoutes');

const path = require('path');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser (required for httpOnly cookie auth)
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Enable CORS
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Serve uploaded prescription files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/medicines', medicines);
app.use('/api/categories', categories);
app.use('/api/brands', brands);
app.use('/api/orders', orders);
app.use('/api/prescriptions', prescriptions);
app.use('/api/settings', settings);
app.use('/api/roles', roles);
app.use('/api/blogs', blogs);
app.use('/api/reviews', reviews);
app.use('/api/coupons', coupons);
app.use('/api/banners', banners);
app.use('/api/users', users);
app.use('/api/analytics', analytics);
app.use('/api/upload', uploadRoute);

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

