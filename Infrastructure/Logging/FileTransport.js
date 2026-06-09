const transport = require("winston-transport");

class FileTransport extends transport {
  async log(info, callback) {
    try {
      // Simulate file logging (replace with actual file writing logic)
      callback();
    } catch (error) {
      console.error("Failed to log to file:", error);
      callback(error);
    }
  }
}

module.exports = FileTransport;
