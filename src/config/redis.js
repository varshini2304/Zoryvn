const { createClient } = require("redis");
const env = require("./env");
const logger = require("../utils/logger");

let redisClient = null;

if (env.redisUrl) {
  redisClient = createClient({
    url: env.redisUrl
  });

  redisClient.on("error", (error) => {
    logger.error("Redis client error", {
      message: error.message
    });
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
    logger.error("Redis connection failed", {
      message: error.message
    });
  }
};

module.exports = {
  connectRedis,
  redisClient
};
