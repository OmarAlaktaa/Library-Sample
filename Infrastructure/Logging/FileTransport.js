const transport = require("winston-transport");

class FileTransport extends transport {
  async log(info, callback) {
    try {
      // Simulate file logging (replace with actual file writing logic)
      console.log(
        `[${new Date().toISOString()}] ${info.level}: ${info.message} (from file logging transport)`,
      );
      callback();
    } catch (error) {
      console.error("Failed to log to file:", error);
      callback(error);
    }
  }
}

module.exports = FileTransport;
