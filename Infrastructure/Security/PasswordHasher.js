const bcrypt = require("bcryptjs");
const config = require("../../config");

class PasswordHasher {
  constructor(saltRounds, logger) {
    this.saltRounds = saltRounds || config.security.saltRounds || 10;
  }

  async hash(password) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async compare(plainPassword, hashedPassword) {
    // returns true if the passwords match, false otherwise
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = PasswordHasher;
