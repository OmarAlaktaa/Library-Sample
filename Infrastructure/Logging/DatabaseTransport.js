const transport = require("winston-transport");
const logModel = require("../Persistence/Models/logModel");

class DatabaseTransport extends transport {
  async log(info, callback) {
    try {
      await logModel.create({
        level: info.level,
        message: info.message,
        timestamp: new Date(),
      });
      callback();
    } catch (error) {
      console.error("Failed to log to database:", error);
      callback(error);
    }
  }
}

module.exports = DatabaseTransport;
