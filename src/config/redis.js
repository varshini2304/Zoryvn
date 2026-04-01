const { createClient } = require("redis");
const env = require("./env");
const logger = require("../utils/logger");

let redisClient = null;
let hasLoggedRedisUnavailable = false;

const getErrorDetails = (error) => {
  return {
    errorMessage: error?.message || error?.code || error?.name || "Unknown Redis error",
    errorCode: error?.code || null,
    errorName: error?.name || null
  };
};

if (env.redisUrl) {
  redisClient = createClient({
    url: env.redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries >= 3) {
          return false;
        }

        return 500;
      }
    }
  });

  redisClient.on("error", (error) => {
    logger.error("Redis client error", getErrorDetails(error));
  });

  redisClient.on("end", () => {
    hasLoggedRedisUnavailable = false;
  });
}

const connectRedis = async () => {
  if (!redisClient || redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
    hasLoggedRedisUnavailable = false;
    logger.info("Redis connected successfully");
  } catch (error) {
    if (!hasLoggedRedisUnavailable) {
      logger.error("Redis connection failed", getErrorDetails(error));
      hasLoggedRedisUnavailable = true;
    }
  }
};

module.exports = {
  connectRedis,
  redisClient
};
