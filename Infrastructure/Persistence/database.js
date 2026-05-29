const mongoose = require("mongoose");
const config = require("../../config");

function connectDB() {
  mongoose
    .connect(config.db.connectionString)
    // This line executes when the connection is successful.
    .then(() => console.log("Connected to MongoDB"))
    // This line executes if there is an error during connection.
    .catch((error) => console.error("MongoDB connection error:", error));
}

module.exports = connectDB;
