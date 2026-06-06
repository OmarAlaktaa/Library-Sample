const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  level: String,
  message: String,
  source: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", LogSchema);
module.exports = Log;
