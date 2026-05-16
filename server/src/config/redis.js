const Redis = require('ioredis');

const redisOptions = {
  retryStrategy(times) {
    if (process.env.NODE_ENV === 'test') return null; // disable retries in test env
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  lazyConnect: process.env.NODE_ENV === 'test',
};

const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, redisOptions)
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      ...redisOptions
    });

let redisConnected = false;

redis.on('connect', () => {
  redisConnected = true;
  console.log('Redis connected');
});

redis.on('error', (err) => {
  if (!redisConnected) {
    console.error('Redis unavailable — caching disabled:', err.message);
  } else {
    console.error('Redis connection lost:', err.message);
  }
  redisConnected = false;
});

module.exports = redis;
