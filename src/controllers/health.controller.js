const { sequelize } = require("../config/db");
const { redisClient } = require("../config/redis");

const getHealth = async (_req, res) => {
  let dbStatus = "disconnected";
  let redisStatus = "unavailable";

  try {
    await sequelize.authenticate();
    dbStatus = "connected";
  } catch (_error) {
    dbStatus = "disconnected";
  }

  try {
    redisStatus = redisClient?.isOpen ? "connected" : "unavailable";
  } catch (_error) {
    redisStatus = "unavailable";
  }

  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      cache: redisStatus
    }
  });
};

module.exports = {
  getHealth
};
