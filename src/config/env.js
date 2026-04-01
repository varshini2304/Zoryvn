const dotenv = require("dotenv");
const path = require("path");

const nodeEnv = process.env.NODE_ENV || "development";

[path.resolve(process.cwd(), ".env"), path.resolve(process.cwd(), `.env.${nodeEnv}`)].forEach(
  (filePath, index) => {
    dotenv.config({
      path: filePath,
      override: index > 0
    });
  }
);

const requiredEnvVars = ["PORT", "DB_URL", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: Number(process.env.PORT),
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  redisUrl: process.env.REDIS_URL || "",
  nodeEnv
};
