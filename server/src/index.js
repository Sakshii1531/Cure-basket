const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

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

// Trust the first proxy hop (Render's load balancer) so rate limiting
// uses the real client IP from X-Forwarded-For, not the shared proxy IP.
app.set('trust proxy', 1);

// Enable CORS
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any Vercel deployment URL (production + preview branches)
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

// Request logging (skip in test to keep output clean)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parser
app.use(express.json());

// Cookie parser (required for httpOnly cookie auth)
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Health check — must be registered BEFORE the rate limiter so Render's
// frequent pings never count against the limit or receive a 429.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date(), uptime: process.uptime() });
});

// Rate limiting — skip health check path as a belt-and-suspenders guard,
// and raise the production cap so normal API usage isn't blocked.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 300,
  skip: (req) => req.path === '/api/health' || req.path === '/',
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use(limiter);



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

// 404 — unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Global error handler — must have 4 args so Express treats it as error middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message;
  res.status(status).json({ success: false, error: message });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

