const TokenService = require("./TokenService");
const logger = require("../../Infrastructure/Logging/logger");

class AuthMiddleware {
  verifyToken(req, res, next) {
    const AUTH_SCHEME = "Bearer ";
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith(AUTH_SCHEME)) {
      logger.warn(
        "Authentication failed - no bearer token provided",
        "AuthMiddleware",
        {
          ip: req.ip,
          path: req.originalUrl,
          method: req.method,
        },
      );

      return res.status(401).json({
        message: "Access Denied: No token provided",
      });
    }

    const token = authHeader.slice(AUTH_SCHEME.length);
    const decodedUser = TokenService.verifyToken(token);

    logger.info(
      `User authenticated successfully (ID=${decodedUser.id})`,
      "AuthMiddleware",
      {
        userId: decodedUser.id,
        role: decodedUser.role,
        path: req.originalUrl,
      },
    );

    req.user = decodedUser;
    next();
  }

  verifyAdmin(req, res, next) {
    if (!req.user) {
      logger.warn(
        "Admin authorization failed - user not authenticated",
        "AuthMiddleware",
        {
          ip: req.ip,
          path: req.originalUrl,
        },
      );

      return res.status(401).json({
        message: "Access Denied: Not authenticated",
      });
    }

    if (req.user.role !== "ADMIN") {
      logger.warn(
        `Admin authorization denied for user ID=${req.user.id}`,
        "AuthMiddleware",
        {
          userId: req.user.id,
          role: req.user.role,
          path: req.originalUrl,
        },
      );

      return res.status(403).json({
        message: "Access Denied: Requires Admin Privileges",
      });
    }

    logger.info(
      `Admin access granted for user ID=${req.user.id}`,
      "AuthMiddleware",
      {
        userId: req.user.id,
        role: req.user.role,
        path: req.originalUrl,
      },
    );

    next();
  }
}

module.exports = new AuthMiddleware();
