const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
require("./models");

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(
      "Failed to connect to database:",
      error.message || error.original?.code || error.name || error
    );
    process.exit(1);
  }

  await connectRedis();

  const port = env.port || 10000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
