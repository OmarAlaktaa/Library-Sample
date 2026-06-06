const winston = require("winston");

const DatabaseTransport = require("./DatabaseTransport");
const FileTransport = require("./FileTransport");
const ConsoleTransport = require("./ConsoleTransport");

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      transports: [
        new FileTransport(),
        new DatabaseTransport(),
        new ConsoleTransport(),
      ],
    });
  }

  info(message, source = "Unknown", metadata = {}) {
    this.logger.info({
      message,
      source,
      metadata,
    });
  }

  warn(message, source = "Unknown", metadata = {}) {
    this.logger.warn({
      message,
      source,
      metadata,
    });
  }

  error(message, source = "Unknown", metadata = {}) {
    this.logger.error({
      message,
      source,
      metadata,
    });
  }

  databaseError(message, error) {
    this.logger.error({
      message,
      source: "Database",
      metadata: {
        error: error?.message,
        stack: error?.stack,
      },
    });
  }
}

module.exports = new Logger();
