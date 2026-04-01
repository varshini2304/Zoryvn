const { redisClient } = require("../config/redis");

class CacheService {
  async get(key) {
    if (!redisClient?.isOpen) {
      return null;
    }

    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, ttlSeconds) {
    if (!redisClient?.isOpen) {
      return;
    }

    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds
    });
  }

  async deleteByPrefix(prefix) {
    if (!redisClient?.isOpen) {
      return;
    }

    const keys = await redisClient.keys(`${prefix}*`);

    if (keys.length) {
      await redisClient.del(keys);
    }
  }
}

module.exports = new CacheService();
