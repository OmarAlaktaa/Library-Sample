const jwt = require("jsonwebtoken");

class TokenService {
  constructor(accessSecret, refreshSecret, logger) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.logger = logger;
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      this.accessSecret,
      {
        expiresIn: "15m",
      },
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
      },
      this.refreshSecret,
      {
        expiresIn: "7d",
      },
    );
  }

  verifyAccessToken(token) {
    return jwt.verify(token, this.accessSecret);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshSecret);
  }
}

module.exports = TokenService;
