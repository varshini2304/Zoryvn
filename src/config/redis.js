const { createClient } = require("redis");
const env = require("./env");
const logger = require("../utils/logger");

let redisClient = null;
let hasLoggedRedisUnavailable = false;

const getErrorDetails = (error) => ({
  errorMessage: error?.message || error?.code || error?.name || "Unknown Redis error",
  errorCode: error?.code || null,
  errorName: error?.name || null
});

if (env.redisUrl) {
  const isTls = env.redisUrl.startsWith("rediss://");

  redisClient = createClient({
    url: env.redisUrl,
    socket: {
      tls: isTls,
      reconnectStrategy: (retries) => {
        if (retries >= 3) {
          if (!hasLoggedRedisUnavailable) {
            logger.error("Redis max reconnection attempts reached - running without cache");
            hasLoggedRedisUnavailable = true;
          }

          return false;
        }

        return Math.min(retries * 500, 1500);
      }
    }
  });

  redisClient.on("error", (error) => {
    if (!hasLoggedRedisUnavailable) {
      logger.error("Redis client error", getErrorDetails(error));
    }
  });

  redisClient.on("end", () => {
    hasLoggedRedisUnavailable = false;
  });

  redisClient.on("connect", () => {
    hasLoggedRedisUnavailable = false;
    logger.info("Redis connected");
  });
}

const connectRedis = async () => {
  if (!redisClient || redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
    logger.info("Redis connected successfully");
  } catch (error) {
    if (!hasLoggedRedisUnavailable) {
      logger.error("Redis connection failed - caching disabled", getErrorDetails(error));
      hasLoggedRedisUnavailable = true;
    }
  }
};

module.exports = {
  connectRedis,
  redisClient
};
