const redis = require('../config/redis');

const cache = (duration) => {
  return async (req, res, next) => {
    // Skip if Redis is not connected or not a GET request
    if (redis.status !== 'ready' || req.method !== 'GET') {
      return next();
    }

    const key = `cb_cache_${req.originalUrl || req.url}`;

    try {
      const cachedData = await redis.get(key);

      if (cachedData) {
        console.log(`Cache hit for ${key}`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Store original send function
      const originalSend = res.json;

      res.json = (body) => {
        res.json = originalSend;
        if (res.statusCode === 200) {
          redis.set(key, JSON.stringify(body), 'EX', duration);
        }
        return originalSend.call(res, body);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      next();
    }
  };
};

// Function to clear cache by pattern
const clearCache = async (pattern) => {
  if (redis.status !== 'ready') return;
  try {
    const keys = await redis.keys(`cb_cache_${pattern}*`);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`Cleared cache for pattern: ${pattern}`);
    }
  } catch (err) {
    console.error('Clear cache error:', err);
  }
};

module.exports = { cache, clearCache };
