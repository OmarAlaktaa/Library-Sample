const transport = require("winston-transport");

class ConsoleTransport extends transport {
  async log(info, callback) {
    try {
      // Simulate console logging (replace with actual console writing logic)
      console.log(
        `[${new Date().toISOString()}] ${info.level}: ${info.message}`,
      );
      callback();
    } catch (error) {
      console.error("Failed to log to console:", error);
      callback(error);
    }
  }
}

module.exports = ConsoleTransport;
