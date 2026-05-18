const Redis = require('ioredis');

let redisConnected = false;
let hasLoggedFailure = false;

const redisOptions = {
  retryStrategy(times) {
    if (process.env.NODE_ENV === 'test') return null; // disable retries in test env
    if (times > 3) {
      if (!hasLoggedFailure) {
        console.warn('⚠️ Redis connection failed after 3 attempts. Caching will be disabled.');
        hasLoggedFailure = true;
      }
      return null; // Stop retrying completely
    }
    // Exponential backoff
    const delay = Math.min(times * 500, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  lazyConnect: process.env.NODE_ENV === 'test',
};

// Check if we should even attempt to connect to Redis
// On serverless platforms or when Redis is not configured, we gracefully disable it
const shouldConnect = process.env.NODE_ENV !== 'test' && (
                      process.env.ENABLE_REDIS === 'true' || 
                      process.env.REDIS_URL || 
                      process.env.REDIS_HOST || 
                      (process.env.NODE_ENV === 'development' && !process.env.DISABLE_REDIS)
);

let redis;

if (shouldConnect) {
  redis = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL, redisOptions)
    : new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        ...redisOptions
      });

  redis.on('connect', () => {
    redisConnected = true;
    hasLoggedFailure = false;
    console.log('✅ Redis connected successfully. Caching enabled.');
  });

  redis.on('error', (err) => {
    if (redisConnected) {
      console.error('❌ Redis connection lost:', err.message);
      redisConnected = false;
    } else if (!hasLoggedFailure) {
      // Only log once before it stops retrying to prevent console spam
      console.error('⚠️ Redis connection failed:', err.message);
      hasLoggedFailure = true;
    }
  });
} else {
  if (process.env.NODE_ENV !== 'test') {
    console.log('ℹ️ Redis is disabled or unconfigured. Caching is inactive.');
  }
  redis = {
    status: 'disabled',
    get: async () => null,
    set: async () => null,
    del: async () => null,
    keys: async () => [],
    on: () => {}
  };
}

module.exports = redis;
