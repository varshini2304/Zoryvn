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

  // Replaces blocking KEYS with non-blocking SCAN iterator
  async deleteByPrefix(prefix) {
    if (!redisClient?.isOpen) {
      return;
    }

    const keys = [];
    for await (const key of redisClient.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) {
      keys.push(key);
    }

    if (keys.length) {
      await redisClient.del(keys);
    }
  }

  // Used for JWT blacklisting
  async exists(key) {
    if (!redisClient?.isOpen) {
      return false;
    }
    const result = await redisClient.exists(key);
    return result === 1;
  }

  // Set a key with TTL in seconds but no value (just existence = blocked)
  async setWithTtl(key, ttlSeconds) {
    if (!redisClient?.isOpen) {
      return;
    }
    await redisClient.set(key, "1", { EX: ttlSeconds });
  }

  async ping() {
    if (!redisClient?.isOpen) {
      return false;
    }
    try {
      const result = await redisClient.ping();
      return result === "PONG";
    } catch {
      return false;
    }
  }
}

module.exports = new CacheService();

