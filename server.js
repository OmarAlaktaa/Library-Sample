const app = require("./app");
const config = require("./config");
const logger = require("./Infrastructure/Logging/logger");
const connectDB = require("./Infrastructure/Persistence/database");

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Server
    app.listen(config.server.port, () => {
      logger.info(
        `Server started successfully on port ${config.server.port}`,
        "Application",
      );
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`, "Application");
    process.exit(1);
  }
};

startServer();
