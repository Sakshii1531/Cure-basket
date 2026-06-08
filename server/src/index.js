const dotenv = require('dotenv');

// Load env vars FIRST — before any local module is required. config/redis.js and
// config/db.js read process.env at require-time to decide whether to connect, so
// the .env file must already be loaded by then or Redis/DB self-disable.
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const compression = require('compression');
const morgan = require('morgan');

const connectDB = require('./config/db');
const redis = require('./config/redis');
const seedSuperAdmin = require('./utils/seed');

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
const chat = require('./routes/chatRoutes');
const subscribers = require('./routes/subscriberRoutes');

const path = require('path');

const app = express();

// Trust the first proxy hop (Render's load balancer) so rate limiting
// uses the real client IP from X-Forwarded-For, not the shared proxy IP.
app.set('trust proxy', 1);

// Gzip/brotli-compress all responses. Big win for JSON payloads (product lists,
// category trees) — cuts bandwidth and time-to-first-byte for every client.
app.use(compression());

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
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Health check — must be registered BEFORE the rate limiter so Render's
// frequent pings never count against the limit or receive a 429.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date(), uptime: process.uptime() });
});

// Rate limiting — skip health check path as a belt-and-suspenders guard,
// and raise the production cap so normal API usage isn't blocked.
// When Redis is configured, share the limit counter across all PM2 cluster
// workers via a Redis store; otherwise fall back to the per-process memory
// store. (The disabled-Redis stub has no `.call`, so this check is safe.)
const rateLimitStore = typeof redis.call === 'function'
  ? new RedisStore({ sendCommand: (...args) => redis.call(...args), prefix: 'cb_rl_' })
  : undefined;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 300,
  skip: (req) => req.path === '/api/health' || req.path === '/',
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
  ...(rateLimitStore ? { store: rateLimitStore } : {}),
});

// Fail open: if the limiter's store errors (e.g. a Redis blip), let the request
// through rather than 500-ing everyone. A 429 on a genuine limit hit is sent by
// the limiter directly and never reaches this callback.
app.use((req, res, next) => limiter(req, res, (err) => {
  if (err) console.error('Rate limiter store error (failing open):', err.message);
  next();
}));



// Serve uploaded prescription files with cross-origin headers to prevent browser blocks
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  res.removeHeader('X-Frame-Options');
  next();
}, express.static(path.join(__dirname, '../uploads')));

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
app.use('/api/chat', chat);
app.use('/api/subscribers', subscribers);

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

// Log unhandled rejections but keep serving. A single stray background rejection
// (e.g. a failed email send) should not drop every in-flight request by killing
// the process. Genuinely fatal states are covered by PM2's auto-restart and
// max_memory_restart guard in ecosystem.config.js.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err?.message || err);
});

