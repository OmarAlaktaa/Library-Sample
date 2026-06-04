const bcrypt = require("bcryptjs");
const config = require("../../config");

class PasswordHasher {
  async hash(password) {
    const saltRounds = config.security.saltRounds || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async compare(plainPassword, hashedPassword) {
    // returns true if the passwords match, false otherwise
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new PasswordHasher();
