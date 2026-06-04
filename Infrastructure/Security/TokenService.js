const jwt = require("jsonwebtoken");
const config = require("../../config");

class TokenService {
  constructor() {
    this.secret = config.security.jwtSecret;
  }

  generateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, this.secret, {
      expiresIn: "1d",
    });
  }

  verifyToken(token) {
    // returns decoded User from token payload if valid, otherwise throws an error
    return jwt.verify(token, this.secret);
  }
}

module.exports = new TokenService();
