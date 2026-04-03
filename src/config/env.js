const dotenv = require("dotenv");
const path = require("path");

const nodeEnv = process.env.NODE_ENV || "development";
const initialEnvKeys = new Set(Object.keys(process.env));
const envFiles = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), `.env.${nodeEnv}`)
];

envFiles.forEach((filePath) => {
  const result = dotenv.config({ path: filePath });

  if (result.error || !result.parsed) {
    return;
  }

  Object.entries(result.parsed).forEach(([key, value]) => {
    if (!initialEnvKeys.has(key) && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
});

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
