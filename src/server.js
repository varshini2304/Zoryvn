const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
require("./models");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message || error.original?.code || error.name || error
    );
    process.exit(1);
  }
};

startServer();
